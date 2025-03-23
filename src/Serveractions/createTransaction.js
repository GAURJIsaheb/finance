"use server"
import { db_Var } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";


const serializeAmountFunction=(obj)=>(
    {
        ...obj,
        amount:obj.amount.toNumber(),
    }
)
const baseURL =
  process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000"; // Fallback for local dev



export async function createTransaction(data){

    try {
        const { userId } = await auth();
                if (!userId) {
                    throw new Error("Authorized User not found !");
                }
                //Arcjet use krenge to limit the NUMBER of transaction,,user can make in 1 Hour
                const response = await fetch(`${baseURL}/api/upstash`);
                const result = await response.json();
                if (response.status === 429) {
                throw new Error("Too many requests. Please try again later.");
                }
                
        
                const user = await db_Var.usersTable_Var.findUnique({
                    where: { clerkUserId: userId },
                });
        
                if (!user) {
                    console.log("User not found in accountsTable");
                    throw new Error("User not found in accountsTable");
                }
                //find particular account,,transaction krein jisme
                const account=await db_Var.accountsTable_Var.findUnique({
                    where:{
                        id:data.accountId,
                        userId:user.id,
                    },
                });
                if(!account){
                    throw new error("Account not found !");
                }
                const balanceChange=data.type ==="EXPENSE"? -data.amount:data.amount;
                const newBalance=account.balance.toNumber()+balanceChange;

                //create transactions,,update them in DB,etc

                //prisma transaction
                const transaction=await db_Var.$transaction(async(tx)=>{
                    const createNewTransaction=await tx.TransactionTable_Var.create({
                        data:{
                            ...data,
                            userId:user.id,                                            //function
                            nextRecurringDate:data.isRecurring && data.recurringInterval ? calculateNextRecurringDate(data.date,data.recurringInterval):null,

                        }
                    });
                    await tx.accountsTable_Var.update({//or account ??
                        where:{id:data.accountId},
                        data:{balance:newBalance},
                    });
                    return createNewTransaction;
                    
                })
                revalidatePath("/dashboard");
                revalidatePath(`/account/${transaction.accountId}`)

                return {success:true,data:serializeAmountFunction(transaction)}

        
    } catch (error) {
        throw new Error(error.message)
    }
}





//helper function to calculate next recurring date
function calculateNextRecurringDate(startDate,interval){
    const date=new Date(startDate);
    switch(interval){
        case "DAILY":
            date.setDate(date.getDate()+1);
            break;
        case "WEEKLY":
            date.setDate(date.getDate()+7);
            break;
        case "MONTHLY":
            date.setMonth(date.getMonth()+1);
            break;
        case "YEARLY":
            date.setFullYear(date.getFullYear()+1);
            break;
    }
    return date;
}