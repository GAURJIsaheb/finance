import AddTransactionForm from '@/components/createTransaction/addtransactionform';
import { defaultCategories } from '@/data/category';
import { getUserAccount } from '@/Serveractions/dashbaordAction'
import React from 'react'

async function Createtransaction() {
  //jo jo accounts hai,,unhe mao krne ki,,and create account krne ka option yahan bhi denge
  const account=await getUserAccount();
  //console.log("account:___>",account);

  return (
    <div className="max-w-3xl mx-auto px-5 pb-8 pt-5">
      <h1 className="text-5xl gradient-title mb-8">Add Transaction</h1>
      <AddTransactionForm
      account={account}
      categories={defaultCategories}/>
    </div>
  )
}

export default Createtransaction