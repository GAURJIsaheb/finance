"use client"
import { endOfDay, format, startOfDay, subDays } from 'date-fns';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select"


import React,{ PureComponent, useMemo, useState }  from 'react'
import { Bar, BarChart, CartesianGrid, Label, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
const DATE_RANGES={
    "7D":{label:"Last 7 Days",days:7},  
    "1M":{label:"Last Month",days:30 },
    "6M":{label:"Last 6 Month",days:180 },
    ALL:{label:"All Time",days:null},

}

function AccountChart({transactions}) {
    const [dateRange,setdateRange]=useState("1M");

    const filteredData=useMemo(()=>{
        const range=DATE_RANGES[dateRange];
        const now=new Date();

        const startDate=range.days 
        ?startOfDay(subDays(now,range.days))
        :startOfDay(new Date(0));
                                                //          more than
        const filtered=transactions.filter((t)=>new Date(t.date)>= startDate && new Date(t.date)<=endOfDay(now))

        const grouped=filtered.reduce((acc,transaction)=>{
          const date=format(new Date(transaction.date),"MMM dd");

          if(!acc[date]){
            acc[date]={date,income:0,expense:0};
          }
          if(transaction.type==="INCOME"){
            acc[date].income +=transaction.amount;
          }
          else{//EXPENSE
            acc[date].expense +=transaction.amount;
          }

          return acc;//accumulator
        },{})

        //Convert Grouped Data to array,,converting it in ascending order
        return Object.values(grouped).sort((a,b)=> new Date(a.date)-new Date(b.date))
    },[transactions,dateRange]);

    const totals=useMemo(()=>{
      return filteredData.reduce(
        (acc,day)=>({
          income:acc.income+day.income,
          expense:acc.expense+day.expense,
        }),
        {income:0, expense:0}
      )
    },[filteredData])
    
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <CardTitle>Transactions Overview</CardTitle>
        <Select defaultValue={dateRange} onValueChange={setdateRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Range" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(DATE_RANGES).map(([key,{label}])=>{
              return(
                <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
              );

            })}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="flex gap-x-10  justify-around">
          <div className="text-center">
            <p className="text-muted-foreground">Total Income</p>
            <p className="text-lg font-bold text-green-500">${totals.income.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">Total Expense</p>
            <p className="text-lg font-bold text-red-600">${totals.expense.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">Net</p>
            <p className={`text-lg font-bold ${totals.income-totals.expense >0 ? "text-black":"text-red-600" }`}>${(totals.income-totals.expense).toFixed(2)}</p>
          </div>
        </div>

        {/*Chart */}
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={filteredData}
          margin={{
            top: 10,
            right: 10,
            left: 10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false}/>
          <XAxis dataKey="date" />
          <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value)=>`$ ${value}`}/>
          <Tooltip formatter={(value)=>[`$ ${value}`,undefined]}/>
          <Legend />
          <Bar dataKey="income" name="Income" fill="#8cf507" radius={[4,4,0,0]} activeBar={<Rectangle fill="pink" stroke="blue" />} />
          <Bar dataKey="expense" name="Expense" fill="#f54107" radius={[4,4,0,0]} activeBar={<Rectangle fill="gold" stroke="purple" />} />
        </BarChart>
      </ResponsiveContainer>
        </div>
      
      </CardContent>

    </Card>

      


  )
}

export default AccountChart