export const dynamic = "force-dynamic";  
import AddTransactionForm from '@/components/createTransaction/addtransactionform';
import { defaultCategories } from '@/data/category';
import { getTransaction } from '@/Serveractions/createTransaction';
import { getUserAccount } from '@/Serveractions/dashbaordAction'
async function Createtransaction({searchParams}) {

  const account = await getUserAccount();
  const editId = searchParams?.edit;

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