import { z } from "zod";
//forms bnane ka kaam ho rha idhr kaunde....

//Add Account krne pr jo form aayega,,uska Schema bunega yahan
export const accountFormschema=z.object({
    name:z.string().min(4,"Name is required"),//minimum 6 digits
    type:z.enum(["CURRENT","SAVINGS"]),
    balance:z.string().min(1,"Initial Balance is required"),
    isDefault:z.boolean().default(false)
})



//schema for addTransaction
export const transactionFormschema=z.object({
    type:z.enum(["INCOME","EXPENSE"]),
    amount:z.string().min(1,"Amount is Required !"),
    description:z.string().optional(),
    date:z.date({required_error:"Date is Required "}),
    accountId:z.string().min(1,"Account is Required "),
    category:z.string().min(1,"Category is Required "),
    isRecurring:z.boolean().default(false),
    recurringInterval:z.enum(["DAILY","MONTHLY","YEARLY"]).optional(),

    //checks
}).superRefine((data,ctx)=>{
    if(data.isRecurring && !data.recurringInterval){
        ctx.addIssue({
            code:z.ZodIssueCode.custom,
            message:"Recurring interval is required for recurring transactions",
            path:["recurringInterval"],
        })
    }
})

