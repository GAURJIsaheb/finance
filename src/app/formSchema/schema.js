import { z } from "zod";

//Add Account krne pr jo form aayega,,uska Schema bunega yahan
export const accountFormschema=z.object({
    name:z.string().min(4,"Name is required"),//minimum 6 digits
    type:z.enum(["CURRENT","SAVINGS"]),
    balance:z.string().min(1,"Initial Balance is required"),
    isDefault:z.boolean().default(false)
})