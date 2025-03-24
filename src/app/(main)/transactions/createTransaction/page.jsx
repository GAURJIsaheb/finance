"use client"
import AddTransactionForm from '@/components/createTransaction/addtransactionform';
import { defaultCategories } from '@/data/category';
import { getTransaction } from '@/Serveractions/createTransaction';
import { getUserAccount } from '@/Serveractions/dashbaordAction'
import React, { useEffect, useState } from 'react'

async function Createtransaction({searchParams}) {
  const [account, setAccount] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const userAccount = await getUserAccount();
      setAccount(userAccount);
      
      const editIdParam = searchParams?.edit;
      setEditId(editIdParam);
      
      if (editIdParam) {
        const transaction = await getTransaction(editIdParam);
        setInitialData(transaction);
      }
    };
    
    fetchData();
  }, [searchParams]);

  if (!account) return <div>Loading...</div>;

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