"use client"
import React, { useEffect, useState } from 'react'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"
import { useForm } from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod'
import { accountFormschema } from '@/app/formSchema/schema';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import useFetch from '../../hooks/use-fetch';
import { createAccount } from '@/Serveractions/dashbaordAction';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

  


// ye install kra hai for this page: npm i react-hook-form zod @hookform/resolvers --legacy-peer-deps ,,,,,react hook forms
//zod --> is validation library for react forms,,validation
function CreateAccountDrawer({children}) {
    const [open,setOpen]=useState(false);

    //For accountFormschema,,use
    const {
      register,//register he apne  accountFormschema ko,,react-hook-form se connect krega
      handleSubmit,
      formState:{errors},
      setValue,
      watch,
      reset}= useForm({
      resolver:zodResolver(accountFormschema),
      defaultValues:{
        name:"",
        type:"CURRENT",
        balance:"",
        isDefault:false
      }
    })




    //Calling use-fetch.jsx se->usefetch() hook
    //data fetch and rename kr rhe,,,e.g: data:newAccount
    const{data:newAccount,error,fn:createAcountFunction,loading:createAccountLoading}=useFetch(createAccount);
    //ACCOUNT Create hone k baad Toast dikhega jo
    useEffect(()=>{
       if(newAccount && !createAccountLoading){
        toast.success("New Account Created Successfully !!");
        reset();//reset our forms
        setOpen(false)//drawer closes
       }


    },[createAccountLoading,newAccount])


    //for handling any error
    useEffect(()=>{
      if(error){
        toast.error(error.message ||"Failed to create account");
      }

    },[error])



    //To subnit the form
    const onSubmit=async(data)=>{
      await createAcountFunction(data);
      //console.log("Data subnitted in Create Account Form "+data)
    }
  return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>{children}</DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                <DrawerTitle>Create New Account ...</DrawerTitle>
                </DrawerHeader>

                {/*Form */}
                <div className="px-4 pb-4">
                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

                      {/*Account Name */}
                       <div className="space-y-2">
                        <label htmlFor='name' className="text-sm font-medium">Account Name
                        </label>
                        <Input id="name" placeholder="e.g: Work"
                        {...register("name")} 
                        />
                        {errors.name && (
                          <p className="text-sm text-red-600">{errors.name.message}</p>
                        )}
                       </div> 



                        {/*Account Type */}
                       <div className="space-y-2">
                        <label htmlFor='type' className="text-sm font-medium">Account Name
                        </label>
                        <Select onValueChange={(value)=> setValue("type",value)}
                                defaultValue={watch("type")}>
                          <SelectTrigger id="type" className="w-[180px]">
                            <SelectValue placeholder="Seelct your Account type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CURRENT">Current</SelectItem>
                            <SelectItem value="SAVINGS">Savings</SelectItem>

                          </SelectContent>
                        </Select>
                        {errors.type && (
                          <p className="text-sm text-red-600">{errors.type.message}</p>
                        )}
                       </div> 





                       {/*Intial Balance */}
                       <div className="space-y-2">
                        <label htmlFor='balance' className="text-sm font-medium">Enter a intial balance 
                        </label>
                        <Input id="balance" placeholder="0.00" type="number" step="0.01"
                        {...register("balance")} 
                        />
                        {errors.balance && (
                          <p className="text-sm text-red-600">{errors.balance.message}</p>
                        )}
                       </div> 




                       {/*is Default */}
                       <div className="flex items-center justify-between rounded-lg border-p-3">
                          <div className="space-y-0.5">
                            <label htmlFor='isDefault' className="text-sm font-medium cursor-pointer">Is Default?</label>
                            <p className="text-sm text-muted-foreground">This account will be selected by default for your transactions</p>
                          </div>
                        <Switch
                          id="isDefault"
                          onCheckedChange={(checked)=> setValue("isDefault",checked)}
                          checked={watch("isDefault")}
                        />
                       </div>

                       <div className="flex gap-4 pt-4">
                        <DrawerClose asChild>
                          <Button type="button" className="bg-black text-white flex-1">Cancel</Button>
                        </DrawerClose>

                        <Button type="submit" className="flex-1 bg-green-500 text-white" disabled={createAccountLoading}>
                          {createAccountLoading?(<> <Loader2 className="mr-2 h-4 w-4 animate-spin"/>Processing...</>
                          ): ("Create"
                          )} </Button>
                       </div>


                    </form>
                </div>
            
            </DrawerContent>
        </Drawer>

  )
}

export default CreateAccountDrawer