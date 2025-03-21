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