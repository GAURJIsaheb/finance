export const dynamic = "force-dynamic";
import CreateAccountDrawer from '@/components/create-account-drawer'
import { Card, CardContent } from '@/components/ui/card'
import { getUserAccount } from '@/Serveractions/dashbaordAction'
import { Plus } from 'lucide-react'
import React  from 'react'
import AccountCard from './_components/account-card'

async function Dashboardpage() {
  const accounts=await getUserAccount();
  //console.log(accounts);
  return (
    <div className="px-5">
            <h1 className="text-6xl font-bold text-purple-700 mb-8 ">Dashboard</h1>
          {/*Budget Progess */}


          {/* Overview */}


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