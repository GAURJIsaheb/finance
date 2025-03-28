"use client"

import { transactionFormschema } from '@/app/formSchema/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import useFetch from '../../../hooks/use-fetch'
import { createTransaction, updateTransaction } from '@/Serveractions/createTransaction'
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
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { ReceiptScanner } from '../AiScanner/ReceiptScanner'

// Loading Component
const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 shadow-2xl animate-pulse">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <svg className="w-8 h-8 text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" 
                 fill="none" 
                 viewBox="0 0 24 24" 
                 stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">Processing Transaction</h3>
            <p className="text-sm text-gray-600">Please wait while we redirect you...</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function AddTransactionForm({account, categories ,editMode = false,initialData = null}) {
    const searchParams=useSearchParams();
    const editId=searchParams.get("edit");
    const [isRedirecting, setIsRedirecting] = useState(false)
    const {register, setValue, handleSubmit, formState:{errors}, watch, getValues, reset} = useForm({
        resolver: zodResolver(transactionFormschema),
        defaultValues:
          editMode && initialData
        ? {
            type: initialData.type,
            amount: initialData.amount.toString(),
            description: initialData.description,
            accountId: initialData.accountId,
            category: initialData.category,
            date: new Date(initialData.date),
            isRecurring: initialData.isRecurring,
            ...(initialData.recurringInterval && {
              recurringInterval: initialData.recurringInterval,
            }),
          }
        : {
            type: "EXPENSE",
            amount: "",
            description: "",
            accountId: account.find((ac) => ac.isDefault)?.id,
            date: new Date(),
            isRecurring: false,
          },
  });

    const router = useRouter();
    const {loading: transactionLoading, fn: transactionFunction, data: transactionResult} = useFetch( editMode? updateTransaction :createTransaction);

    const type = watch("type");
    const isRecurring = watch("isRecurring");
    const date = watch("date");

    const filteredCategories = categories.filter((category) => category.type === type);

    const onSubmitFunction = async (data) => {
      const formData = {
        ...data,
        amount: parseFloat(data.amount),
      };
      if(editMode){
        transactionFunction(editId,formData);
      }
      else{
        await transactionFunction(formData);
      }
    };

    useEffect(() => {
      if (transactionResult) {
        if (transactionResult.success && !transactionLoading) {
          setIsRedirecting(true) // Only show loading for successful case
          toast.success(editMode?"Transaction Updated Successfully":"Transaction Created Successfully");
          reset();
          setTimeout(() => {
            router.push(`/account/${transactionResult.data.accountId}`)
          }, 1000);
        } else if (!transactionResult.success && !transactionLoading) {
          // Handle unsuccessful case without loading screen
          toast.error(transactionResult.error || "Failed to create transaction");
        }
      }
    }, [transactionResult, transactionLoading, router, reset, editMode]);


    //for Ai scanner
    const handleScanComplete=(scannedData)=>{
      if (scannedData) {
        console.log("Scanned Data:",scannedData);
        setValue("amount", scannedData.amount.toString());
        setValue("date", new Date(scannedData.date));
        if (scannedData.description) {
          setValue("description", scannedData.description);
        }
        if (scannedData.category) {
          const matchedCategory = categories.find(cat => cat.name.toLowerCase() === scannedData.category.toLowerCase());
          if (matchedCategory) {
            setValue("category", matchedCategory.id); // Set ID, not name
          }
        }
        toast.success("Receipt scanned successfully");
      }
    };

    return (
      <>
        {isRedirecting && <LoadingScreen />}
        <form className="space-y-6" onSubmit={handleSubmit(onSubmitFunction)}>
        <h1 className="text-5xl bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent mb-8">
           {editId ? "Edit" : "Add"} Transaction </h1>
          {/*AI Receipt Scanner */}
          {!editMode && <ReceiptScanner onScanComplete={handleScanComplete} />}

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
                      value={item.id}> {item.name} (${parseFloat(item.balance).toFixed(2)}) 
                    </SelectItem>
                  ))}
                  <CreateAccountDrawer>
                    <Button variant="ghost" className="w-full select-none items-center text-sm outline-none">
                      Create Account
                    </Button>
                  </CreateAccountDrawer>
                </SelectContent>
              </Select>
              {errors.accountId && (
                <p className="text-sm text-red-600">{errors.accountId.message}</p>
              )}
            </div>
          </div>



          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select
              value={watch("category")} // Use watch() to dynamically update selection
              onValueChange={(value) => setValue("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category.message}</p>
            )}
          </div>

          {/* Date */}
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
                <Calendar 
                  mode="single" 
                  selected={date} 
                  onSelect={(date)=>setValue("date",date)} 
                  disabled={(date)=> date>new Date() || date < new Date("1950-01-01") } 
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.date && (
              <p className="text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Input placeholder="Enter Description..." {...register("description")} />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Switch Case for is Recurring */}
          <div className="flex items-center justify-between rounded-lg border-p-3">
            <div className="space-y-0.5">
              <label htmlFor='isDefault' className="text-sm font-medium cursor-pointer">
                Recurring Transaction
              </label>
              <p className="text-sm text-muted-foreground">
                Setup a Recurring Schedule for this transaction.
              </p>
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

          {/* Cancel and Create Button */}
          <div className="flex gap-4">
            <Button
              type="Button"
              variant="outline"
              className="w-full"
              onClick={()=>router.back()}
              disabled={transactionLoading}
            >Cancel</Button>

            <Button
              type="submit" 
              className="w-full" 
              disabled={transactionLoading}
            >
              {transactionLoading ? "Processing..." : editMode ?"Update Transaction":"Create Transaction"}
            </Button>
          </div>
        </form>
      </>
    )
}

export default AddTransactionForm