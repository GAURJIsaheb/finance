import AddTransactionForm from '@/components/createTransaction/addtransactionform';
import { defaultCategories } from '@/data/category';
import { getTransaction } from '@/Serveractions/createTransaction';
import { getUserAccount } from '@/Serveractions/dashbaordAction'
import React from 'react'

async function Createtransaction({searchParams}) {
  //jo jo accounts hai,,unhe mao krne ki,,and create account krne ka option yahan bhi denge
  const account=await getUserAccount();
  //console.log("account:___>",account);

  const editId=searchParams?.edit;
  // console.log("id---?",searchParams);
  let initialData = null;
  if (editId) {
    const transaction = await getTransaction(editId);
    initialData = transaction;
  }

  return (
    <div className="max-w-3xl mx-auto px-5 pb-8 pt-5">
      <h1 className="text-5xl gradient-title mb-8">{editId? "Edit":"Add"} Transaction</h1>
      <AddTransactionForm
      account={account}
      categories={defaultCategories}
      editMode={!!editId}
      initialData={initialData}
      />
    </div>
  )
}

export default Createtransaction