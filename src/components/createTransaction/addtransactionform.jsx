"use client"
import { transactionFormschema } from '@/app/formSchema/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import useFetch from '../../../hooks/use-fetch'
import { createTransaction } from '@/Serveractions/createTransaction'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from '../ui/input'
import CreateAccountDrawer from '../create-account-drawer'
import { Button } from '../ui/button'
import { format } from 'date-fns'
import { Calendar1Icon } from 'lucide-react'
import { Calendar } from '../ui/calendar'
import { Switch } from '../ui/switch'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'


function AddTransactionForm({account,categories}) {
    const {register,setValue,handleSubmit,formState:{errors},watch,getValues,reset}=useForm({
        resolver:zodResolver(transactionFormschema),
        defaultValues:{
            type:"EXPENSE",
            amount:"",
            description:"",
            accountId:account.find((ac)=> ac.isDefault)?.id || "",
            date:new Date(),
            isRecurring:false,

        }
    });

    const router=useRouter();

    const{loading:transactionLoading,
          fn:transactionFunction,
          data:transactionResult,
    }=useFetch(createTransaction);


    const type=watch("type");
    const isRecurring=watch("isRecurring");
    const date=watch("date");

    const filteredCategories=categories.filter((category)=>category.type===type);

    const onSubmitFunction=async(data)=>{
      const formData={
        ...data,
        amount:parseFloat(data.amount),
      }
      transactionFunction(formData)
    };

    useEffect(()=>{
      if(transactionResult?.success && !transactionLoading){
        toast.success("Transaction Created Successfully");
        reset();//reset the form
        router.push(`/account/${transactionResult.data.accountId}`)
      }
    },[transactionResult,transactionLoading])

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmitFunction)}>
      {/*AI Reciept Scanner ---yahan aayega Ai ka kaam */}




    <div className="space-y-2">
      <label className="text-sm font-medium">Type</label>
      <Select onValueChange={(value)=>setValue("type",value)}
        defaultValue={type}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="INCOME">Income</SelectItem>
          <SelectItem value="EXPENSE">Expense</SelectItem>

        </SelectContent>
      </Select>
      {errors.type && (
        <p className="text-sm text-red-600">{errors.type.message}</p>
      )}

    </div>



    <div className="grid gap-6 md:grid-cols-2">
    <div className="space-y-2">
      <label className="text-sm font-medium">Amount</label>
      <Input 
      type="number"
      step="0.01"
      placeholder="0"
      {...register("amount")}
      />
      {errors.amount && (
        <p className="text-sm text-red-600">{errors.amount.message}</p>
      )}

    </div>



    <div className="space-y-2">
      <label className="text-sm font-medium">Account</label>
      <Select 
      onValueChange={(value)=>setValue("accountId",value)}
        defaultValue={getValues("accountId")}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Account" />
        </SelectTrigger>
        <SelectContent>
          {account.map((item)=>(
              <SelectItem key={item.id} 
              value={item.id}> {item.name} (${parseFloat(item.balance).toFixed(2)}) </SelectItem>

          ))}

          <CreateAccountDrawer>
            <Button variant="ghost" className="w-full select-none items-center text-sm outline-none">Create Account</Button>
          </CreateAccountDrawer>

        </SelectContent>
      </Select>
      {errors.accountId && (
        <p className="text-sm text-red-600">{errors.accountId.message}</p>
      )}

    </div>

    
    </div>


    {/*Category */}
    <div className="space-y-2">
      <label className="text-sm font-medium">Category</label>
      <Select 
      onValueChange={(value)=>setValue("category",value)}
        defaultValue={getValues("category")}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Category" />
        </SelectTrigger>
        <SelectContent>
          {filteredCategories.map((item)=>(
              <SelectItem key={item.id} 
              value={item.id}> {item.name} </SelectItem>

          ))}



        </SelectContent>
      </Select>
      {errors.category && (
        <p className="text-sm text-red-600">{errors.category.message}</p>
      )}

    </div>



{/*Date */}
    <div className="space-y-2">
      <label className="text-sm font-medium">Date</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button className="w-full pl-3 text-left font-normal" variant="outline">
          {date ? format(date,"PPP"):<span>Pick a date</span>}
          <Calendar1Icon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={date} onSelect={(date)=>setValue("date",date)} 
          disabled={(date)=> date>new Date() || date < new Date("1950-01-01") } initialFocus/>
        </PopoverContent>
      </Popover>

      
      {errors.date && (
        <p className="text-sm text-red-600">{errors.date.message}</p>
      )}

    </div>


    {/*Description */}
    <div className="space-y-2">
      <label className="text-sm font-medium">Description</label>
      <Input placeholder="Enter Description..." {...register("description")} />

      {errors.description && (
        <p className="text-sm text-red-600">{errors.description.message}</p>
      )}

    </div>


    {/*Switch Case for is Recurring */}
        <div className="flex items-center justify-between rounded-lg border-p-3">
          <div className="space-y-0.5">
            <label htmlFor='isDefault' className="text-sm font-medium cursor-pointer">Recurring Transaction</label>
            <p className="text-sm text-muted-foreground">Setup a Recurring Schedule for this transaction.</p>
          </div>
        <Switch
          checked={isRecurring}
          onCheckedChange={(checked)=> setValue("isRecurring",checked)}

        />
        </div>
        {isRecurring && (
              <div className="space-y-2">
              <label className="text-sm font-medium">Recurring Interval</label>
              <Select 
              onValueChange={(value)=>setValue("recurringInterval",value)}
                defaultValue={getValues("recurringInterval")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DAILY">Daily</SelectItem>
                  <SelectItem value="WEEKLY">Weekly</SelectItem>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="YEARLY">Yearly</SelectItem>
                </SelectContent>
              </Select>
              {errors.recurringInterval && (
                <p className="text-sm text-red-600">{errors.recurringInterval.message}</p>
              )}
        
            </div>
        )}



        {/*Cancel and Create Button */}
        <div className="flex gap-4">
          <Button
            type="Button"
            variant="outline"
            className="w-full"
            onClick={()=>router.back()}
          >Cancel</Button>

          <Button
            type="submit" className="w-full" disabled={transactionLoading}
          >Create Transaction</Button>
        </div>
        



    </form>
  )
}

export default AddTransactionForm