export const dynamic = "force-dynamic";
import CreateAccountDrawer from '@/components/create-account-drawer'
import { Card, CardContent } from '@/components/ui/card'
import { getDashboardData, getUserAccount } from '@/Serveractions/dashbaordAction'
import { Plus } from 'lucide-react'
import React, { Suspense }  from 'react'
import AccountCard from './_components/account-card'
import { getCurrentBudget } from '@/Serveractions/budget';
import BudgetComponent from './_components/budgetComponent';
import { DashboardOverview } from './_components/DashboardOverview';

async function Dashboardpage() {
  const accounts=await getUserAccount();


  //Budget is for Default Account,,only
  const defaultAccount=accounts?.find((account)=>account.isDefault);
  let budgetData=null;
  if(defaultAccount){
    budgetData=await getCurrentBudget(defaultAccount.id);
  }
  //console.log(accounts);
  const transactions = await getDashboardData();
;
  return (
    <div className="px-5">
            <h1 className="text-6xl font-bold text-purple-700 mb-8 ">Dashboard</h1>
            {defaultAccount && 
            <BudgetComponent
              initialBudget={budgetData?.budget}
              currentExpenses={budgetData?.currentExpenses || 0}

            />}
  



          {/* Overview */}
          <Suspense fallback={"Loading Overiview"}>
            <DashboardOverview accounts={accounts} transactions={transactions ||[]}/>

          </Suspense>


          {/*Account Grids */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8 mt-8">
            <CreateAccountDrawer>
              <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed">
                <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full pt-5">
                  <Plus className="h-10 w-10 mb-2"/>
                  <p className="text-sm font-medium">Add New Account</p>
                </CardContent>
              </Card>
            </CreateAccountDrawer>
            
            
            {/* Mapping over accounts */}
            {accounts && Object.values(accounts).length > 0 && Object.values(accounts).map((item) => {
              return (
              <AccountCard key={item.id} account={item}/>
          );
        })}
          </div>

          



        
    </div>
  )
}

export default Dashboardpage