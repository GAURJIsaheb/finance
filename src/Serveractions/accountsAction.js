"use server"
import { db_Var } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const serializeTransaction=(obj)=>{//Decimal into Number mai convert krega Amount
    const serialized={...obj};

    if(obj.balance){
        serialized.balance=obj.balance.toNumber();
    }
    if(obj.amount){
        serialized.amount=obj.amount.toNumber();
    }
    return serialized;

}

/*Add Account ki side mai jo,,Already Created Account Card mai show ho rhe jo,,,
usme toggle ka option Jispr On kro tum-->vhi Default Account Bun jaaye,,,Baaki .,,jo pehle Default tha,,
Vo Toogle Back/Off ho jaayein,,, */
export async function updateDefaultAccount(accountId){
    try{
        //First ye dekho ki User hai DB mai ya nhi
        const {userId}=await auth();
                if(!userId){
                    throw new Error("No User_Id found in dashboardAction.js File");
                }
                const user=await db_Var.usersTable_Var.findUnique({
                    where:{clerkUserId:userId},//clerkUserId-->aaya hai--->usersTable_Var se-->prisma.schema se
                });
                if(!user){
                    throw new Error("User not found in usersTable_Var Database");//Sirf Database likh dena baad mai
                }

                //updation in Accounts
                await db_Var.accountsTable_Var.updateMany({
                    where:{userId:user.id,isDefault:true},//find krke
                    data:{isDefault:false},//Default false kro
                })

                const accountData=await db_Var.accountsTable_Var.update({
                    where:{
                        id:accountId,
                        userId:user.id
                    },
                    data:{isDefault:true},
                });

                //revalidatePath("/dashboard")

                return {success:true,data:serializeTransaction(accountData)}
    }
    catch(error){
        throw new Error(`Error in accountsAction.js file 1st Function: ${error.message}`)
    }
}




//accounts/[id]/page.jsx,,pr Saari Details Fetch krne k liye,,Arrow[Income,Expense ],,click krke khulega ya
export async function getAccountTransactions(accountId){
    try{
        //First ye dekho ki User hai DB mai ya nhi
        const {userId}=await auth();
                if(!userId){
                    throw new Error("No User_Id found in dashboardAction.js File");
                }
                const user=await db_Var.usersTable_Var.findUnique({
                    where:{clerkUserId:userId},//clerkUserId-->aaya hai--->usersTable_Var se-->prisma.schema se
                });
                if(!user){
                    throw new Error("User not found in usersTable_Var Database");//Sirf Database likh dena baad mai
                }
                const account=await db_Var.accountsTable_Var.findUnique({
                    where:{id:accountId,userId:user.id},
                    include:{
                        transactions:{
                            orderBy:{date:"desc"}
                        },
                        _count:{
                            select:{transactions:true},
                        },
                        
                    }
                })
                if(!account) return null;
                return{
                    ...serializeTransaction(account),
                    transactions:account.transactions.map(serializeTransaction)
                }
    }
    catch(error){
        throw new Error(`Error in accountsAction.js file 2nd Function : ${error.message}`)
    }
}