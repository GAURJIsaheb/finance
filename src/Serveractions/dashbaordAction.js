"use server"

import { db_Var } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache";
//CreateAccount krega ye Page


const serializeTransaction=(obj)=>{//Decimal into Number mai convert krega Amount
    const serialized={...obj};

    if(obj.balance){
        serialized.balance=obj.balance.toNumber();
    }
    if(obj.amount){
        serialized.balance=obj.balance.toNumber();
    }
    return serialized;

}
export async function createAccount(data){//data se,,-- accountsTable_Var -- Table ka,,name,type,balance,isDefault,,pass krenge
    try{
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

        //Jbh user hai DB mai to,,accountsTable_Var se kuch Values le rhe honge hum

        /*-->1.)Convert balance into float*/
        const balance_float=parseFloat(data.balance);
        if(isNaN(balance_float)){//if balance_float is not a number
            throw new Error("Invalid Balance Amount");
        }



        /*-->2.)Check krenge ki User ka kya 1st Account hoga jo bna rha hai vo...if yes??then keep it isDefault account==true*/
        const existingAccounts=await db_Var.accountsTable_Var.findMany({
            where:{userId:user.id},
        })
        //if options mai Khudse pass kr rha user ki ye account default hoga
        const shouldbe_Default=existingAccounts.length === 0 ? true:data.isDefault;

        //if Default krna hai Current Account,,to Purane Accounts hain agr jo,,unhe NON DEFAULT,,,KRO
        if(shouldbe_Default){
            await db_Var.accountsTable_Var.updateMany({
                where:{userId:user.id,isDefault:true},//find krke
                data:{isDefault:false},//Default false kro
            })
        }

        /*--3.) Simply Create the new Account */
        const account_details=await db_Var.accountsTable_Var.create({
            data:{
                ...data,
                balance:balance_float,
                userId:user.id,
                isDefault:shouldbe_Default,
            }
        });
        /*--4.)Next js Decimal Values Handle nhi krata,,,to return krne se pehle Amount float mai hai jo,,usae Handle krna pdega */
        const serialized_Account=serializeTransaction(account_details);

        revalidatePath("/dashboard");//call to Reload Dashboard page,,shyd se
        return {success:true,data:serialized_Account};
    
    }
    catch(error){
        throw new Error("Error in Last Catch message in dashboardAction.js 1st Function file"+error.message);
    }
}







//2nd server action to render the details of Account
export async function getUserAccount(){
    try {
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

        //login kiye gye user ki id mil gye to accountsTable_Var se account table mai dhundho usae
        const account=await db_Var.accountsTable_Var.findMany({
            where:{userId:user.id},
            orderBy:{createdAt:"desc"},
            include:{
                _count:{
                    select:{
                        transactions:true
                    }
                }
            }
        });
        // **Fix: Map over accounts and serialize each one**
        const serializedAccounts = account.map(serializeTransaction);
        return serializedAccounts;
        
    } catch (error) {
        throw new Error("Error in Last Catch message in dashboardAction.js file 2nd Function"+error.message);
    }
}