import { sendEmail } from "@/Serveractions/sendEmail";
import { db_Var } from "../prisma";
import { inngest } from "./client";
import Email from "../../../emails/template";



export const checkBudgetAlert = inngest.createFunction(
  { id: "Check Budget Alerts" },
  { cron: "0 */6 * * *" },
  async ({step }) => {
    const budgets=await step.run("fetch-budget",async()=>{
      return await db_Var.BudgetTable_Var.findMany({
        include:{
          user:{
            include:{
              accounts:{
                where:{
                  isDefault:true,
                },
              }
            },
          }
        }
      });
    });
    //go thorugh each and every Budget ,,if Budget reach krne vaala hai,,to email bhejega
    for(const budget of budgets){
        const defaultAccount=budget.user.accounts[0];
        if(!defaultAccount) continue;
        await step.run(`check-budget-${budget.id}`,async()=>{
        const startDate=new Date();
        startDate.setDate(1);//start of current Month
        //getting the current Month Expense
        const currentDate=new Date();
        const startofMonth=new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1
        );
        const endofMonth=new Date(
            currentDate.getFullYear(),
            currentDate.getMonth()+1,
            0
        );

        const expenses=await db_Var.TransactionTable_Var.aggregate({
          where:{
            userId:budget.userId,
            accountId:defaultAccount.id,
            type:"EXPENSE",
            date:{
              gte:startofMonth,//gte-->greaterthan
              lte:endofMonth,//lte-->lower than
            },
          },
          _sum:{
            amount:true,
          }
        });

        const totalExpenses=expenses._sum.amount?.toNumber() ||0;
        const budgetAmount=budget.amount;
        const percentageUsed=(totalExpenses/budgetAmount)*100;
        //console.log("--->",percentageUsed);
        //               for tracking last alert sent
        if(percentageUsed >=80 && (budget.lastAlertSent || isNewMonth(new Date(budget.lastAlertSent),new Date()))){

          //--->{send email..we used-->react email,,resend email package}
          await sendEmail({
            to:budget.user.email,//receiver
            subject:`Budget Alert for ${defaultAccount.name}`,
            react:Email({
              userName:budget.user.name,
              type:"budget-alert",
              data:{
                percentageUsed,
                budgetAmount:parseInt(budgetAmount).toFixed(1),
                totalExpense:parseInt(totalExpenses).toFixed(1),
                accountName:defaultAccount.name,
              }
            }),//template of email
          })





          //update LastAlertSent
          await db_Var.BudgetTable_Var.update({
            where:{id:budget.id},
            data:{lastAlertSent:new Date()},
          })
        }
      })
    }
  },
);







function isNewMonth(lastAlertDate,currentDate){
  return(
    lastAlertDate.getMonth() !==currentDate.getMonth() ||
    lastAlertDate.getFullYear()!==currentDate.getFullYear()
  );
}











//Recurring Function,,khudse Apne time pr Add ho jaaye aapki table pr
export const triggerRecurringTransactions = inngest.createFunction(
  {
    id: "trigger-recurring-transactions", // Unique ID,
    name: "Trigger Recurring Transactions",
  },
  { cron: "0 0 * * *" }, //Executes Daily at midnight
  async ({ step }) => {
    //1st step..fetch all recuring Transactions
    const recurringTransactions = await step.run(
      "fetch-recurring-transactions",
      async () => {
        return await db_Var.TransactionTable_Var.findMany({
          where: {
            isRecurring: true,
            status: "COMPLETED",
            OR: [
              { lastProcessed: null },
              {
                nextRecurringDate: {lte: new Date()},
              },
            ],
          },
        });

        
      }
    );
    //console.log("REcurring Transactions :::",recurringTransactions);  // Log to verify data

    // Send event for each recurring transaction in batches
    if (recurringTransactions.length > 0) {
      const events = recurringTransactions.map((transaction) => ({
        name: "transaction.recurring.process",
        data: {
          transactionId: transaction.id,
          userId: transaction.userId,
        },
      }));

      // Send events directly using inngest.send()
      //console.log("EVents--->",events); 
      await inngest.send(events);
    }

    return { triggered: recurringTransactions.length };
  }
);

//Now we need to Trigger Each and Every Event
export const processRecurringTransaction = inngest.createFunction(
  {
    id: "process-recurring-transaction",
    name: "Process Recurring Transaction",
    throttle: {
      limit: 10, // Process 10 transactions
      period: "1m", // per minute
      key: "event.data.userId", // Throttle per user
    },
  },
  { event: "transaction.recurring.process" },
  async ({ event, step }) => {
    // Validate event data
    if (!event?.data?.transactionId || !event?.data?.userId) {
      console.error("Invalid event data:", event);
      return { error: "Missing required event data" };
    }

    await step.run("process-transaction", async () => {
      const transaction = await db_Var.TransactionTable_Var.findUnique({
        where: {
          id: event.data.transactionId,
          userId: event.data.userId,
        },
        include: {
          account: true,
        },
      });

      if (!transaction || !isTransactionDue(transaction)) return;

      // Create new transaction and update account balance in a transaction
      await db_Var.$transaction(async (tx) => {
        // Create new transaction
        await tx.TransactionTable_Var.create({
          data: {
            type: transaction.type,
            amount: transaction.amount,
            description: `${transaction.description} (Recurring)`,
            date: new Date(),
            category: transaction.category,
            userId: transaction.userId,
            accountId: transaction.accountId,
            isRecurring: false,
          },
        });

        // Update account balance
        const balanceChange =
          transaction.type === "EXPENSE"
            ? -transaction.amount.toNumber()
            : transaction.amount.toNumber();

        await tx.accountsTable_Var.update({
          where: { id: transaction.accountId },
          data: { balance: { increment: balanceChange } },
        });

        // Update last processed date and next recurring date
        await tx.TransactionTable_Var.update({
          where: { id: transaction.id },
          data: {
            lastProcessed: new Date(),
            nextRecurringDate: calculateNextRecurringDate(
              new Date(),
              transaction.recurringInterval
            ),
          },
        });
      });
    });
  }
);
// Utility functions
function isTransactionDue(transaction) {
  // If no lastProcessed date, transaction is due
  if (!transaction.lastProcessed) return true;

  const today = new Date();
  const nextDue = new Date(transaction.nextRecurringDate);

  // Compare with nextDue date
  return nextDue <= today;
}

function calculateNextRecurringDate(date, interval) {
  const next = new Date(date);
  switch (interval) {
    case "DAILY":
      next.setDate(next.getDate() + 1);
      break;
    case "WEEKLY":
      next.setDate(next.getDate() + 7);
      break;
    case "MONTHLY":
      next.setMonth(next.getMonth() + 1);
      break;
    case "YEARLY":
      next.setFullYear(next.getFullYear() + 1);
      break;
  }
  return next;
}

















