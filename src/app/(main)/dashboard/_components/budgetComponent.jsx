"use client"
import React, { useEffect, useState } from 'react'
import { Progress } from "@/components/ui/progress"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, Pencil, X } from 'lucide-react';
import useFetch from '../../../../../hooks/use-fetch';
import { toast } from 'sonner';
import { updatingBudget } from '@/Serveractions/budget';
  

function BudgetComponent({initialBudget,currentExpenses}) {
    const [isEditing,setisEditing]=useState(false);
    const [newBudget,setnewBudget]=useState(
        initialBudget?.amount?.toString()||""
    );
    //For Showing Percentage of Used Budget in a Loader
    const percentageUsed=newBudget?(currentExpenses/newBudget)*100
    :0

    const {
        loading:isLoading,
        fn:updateBudgetFn,
        data:updateBudget,
        error,
    }=useFetch(updatingBudget);

    

    const handleUpdateBudget=async()=>{
        const amount=parseFloat(newBudget);
        if(isNaN(amount) || amount<=0){
            toast.error("Please enter a valid amount");
            return;
        }
        try {
            const updatedData = await updateBudgetFn(amount);
            //console.log("Updated Budget Response:", updatedData); // Debugging
    
            if (updatedData?.success) {
                setnewBudget(updatedData.data.amount.toString());
                setisEditing(false);
                toast.success("Budget updated successfully!!");
            }
        } catch (err) {
            console.error("Budget update error:", err);
            toast.error("Failed to update budget.");
        }
    };
    //when Budget is updated
    useEffect(()=>{
        //console.log("Updated Budget from useFetch:", updateBudget);
        if(updateBudget?.success){
            setnewBudget(updateBudget.data.amount.toString());
            setisEditing(false);
            toast.success("Budget updated successfully !!");

        }
    },[updateBudget]);
    
    useEffect(()=>{
        if(error){
            setisEditing(false);
            toast.error(error.message||"Failed to update the budget...")
        }
    },[error]);



    const handleCancel=()=>{
        setnewBudget(initialBudget?.amount?.toString() ||"");
        setisEditing(false);
    };


  return (
    <Card className="relative p-1 before:absolute before:inset-0 before:bg-gradient-to-r before:from-pink-500 before:via-purple-500 before:to-blue-500 before:animate-borderMove before:-z-10 before:rounded-lg">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex-1">
            <CardTitle>Monthly Budget (Default Account)</CardTitle>
            <div className="flex items-center gap-2 mt-1">
                {isEditing ? (
                    <div className="flex items-center gap-2">
                        <Input
                            type="number"
                            value={newBudget}
                            onChange={(e) => setnewBudget(e.target.value)}
                            placeholder="Enter Amount"
                            className="w-32"
                            autoFocus
                            disabled={isLoading}
                        />
                        <Button variant="ghost" size="icon" onClick={handleUpdateBudget}>
                            <Check className="h-4 w-4 text-green-500" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleCancel} disabled={isLoading}>
                            <X className="h-4 w-4 text-red-700" />
                        </Button>
                    </div>
                ) : (
                    <>
                    <CardDescription>
                        {newBudget && currentExpenses
                            ? `$ ${currentExpenses.toFixed(2)} of $ ${parseFloat(newBudget).toFixed(2)} spent`
                            : "No Budget set"}
                    </CardDescription>

                        <Button variant="ghost" size="icon" onClick={() => setisEditing(true)} className="h-6 w-6">
                            <Pencil className="h-3 w-3" />
                        </Button>
                    </>
                )}
            </div>
        </div>
    </CardHeader>
    <CardContent>
        {initialBudget && (
            <div className="space-y-2">
                <Progress
                    value={percentageUsed}
                    extraStyles={`${
                        percentageUsed >= 90
                            ? "bg-red-700"
                            : percentageUsed >= 75
                            ? "bg-purple-700"
                            : "bg-green-500"
                    }`}
                />
                <p className="text-xs text-muted-foreground text-right">{percentageUsed.toFixed(1)}% used</p>
            </div>
        )}
    </CardContent>
</Card>


  )
}

export default BudgetComponent