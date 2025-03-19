"use server"
import { db_Var } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

//BUDGET set up vagera ka,,uske 80% reach kr gya to MAIL vagera bhi bhejega..jamureee

//Fetching the budget
export async function getCurrentBudget(accountId){
    try{
        //vhi check kro,,pehle user hai ya nhi
        const {userId}=await auth();
                if(!userId){
                    throw new Error("No User_Id found in dashboardAction.js File");
                }
                const user=await db_Var.usersTable_Var.findUnique({
                    where:{clerkUserId:userId},//clerkUserId-->aaya hai--->usersTable_Var se-->prisma.schema se
                });
                if(!user){
                    throw new Error("User not found in accountsTable ");//Sirf Database likh dena baad mai
                }
                const budget=await db_Var.BudgetTable_Var.findFirst({
                    where:{
                        userId:user.id,
                    },
                });

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
                //Add/Calculate All of the expenses
                const expenses=await db_Var.TransactionTable_Var.aggregate({
                    where:{
                        userId:user.id,
                        type:"EXPENSE",
                        date:{
                            gte:startofMonth,//gte-->greaterthan
                            lte:endofMonth,//lte-->lower than
                        },
                        accountId,
                    },
                    _sum:{
                        amount:true,
                    }
                });
                //with respect to our budget
                return{
                    budget:budget?{...budget,amount:budget.amount.toNumber()}:null,
                    currentExpenses:expenses._sum.amount?expenses._sum.amount.toNumber():0,
                };

    }catch(error){
        throw new error("Error in the 1st function of budget.js file ",error.message);
    }

}



//for updating the budget
export async function updatingBudget(amount) {
    try {
        //console.log("Updating budget for amount:", amount);
        const { userId } = await auth();
        if (!userId) {
            //console.log("No User_Id found");
            throw new Error("No User_Id found in dashboardAction.js File");
        }

        const user = await db_Var.usersTable_Var.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user) {
            console.log("User not found in accountsTable");
            throw new Error("User not found in accountsTable");
        }

        const budget = await db_Var.BudgetTable_Var.upsert({
            where: { id: user.id },
            update: { amount },
            create: { userId: user.id, amount },
        });

       // console.log("Budget updated successfully:", budget);
        revalidatePath("/dashboard");

        return {
            success: true,
            data: { ...budget, amount: budget.amount.toNumber() },
        };
    } catch (error) {
        console.log("Error in updatingBudget:", error);
        return { success: false, error: error.message };
    }
}
