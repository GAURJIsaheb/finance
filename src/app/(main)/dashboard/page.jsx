"use client";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useEffect, useState } from "react";
import CreateAccountDrawer from "@/components/create-account-drawer";
import { Card, CardContent } from "@/components/ui/card";
import { getDashboardData, getUserAccount } from "@/Serveractions/dashbaordAction";
import { Plus } from "lucide-react";
import AccountCard from "./_components/account-card";
import { getCurrentBudget } from "@/Serveractions/budget";
import BudgetComponent from "./_components/budgetComponent";
import { DashboardOverview } from "./_components/DashboardOverview";

export default function Dashboardpage() {
  const [accounts, setAccounts] = useState(null);
  const [transactions, setTransactions] = useState(null);
  const [budgetData, setBudgetData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const fetchedAccounts = await getUserAccount();
      setAccounts(fetchedAccounts);

      const defaultAccount = fetchedAccounts?.find((account) => account.isDefault);
      if (defaultAccount) {
        const fetchedBudget = await getCurrentBudget(defaultAccount.id);
        setBudgetData(fetchedBudget);
      }

      const fetchedTransactions = await getDashboardData();
      setTransactions(fetchedTransactions);

      setIsLoading(false); // All data is loaded
    }

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="pb-5 ">
        <DotLottieReact
        src="/abc.lottie"
        loop
        autoplay
      />
      <h1 className="text-bold text-black text-center text-5xl">Loading...</h1>
      </div>

    );
  }

  return (
    <div className="pt-20 pb-4">
      <h1 className="text-6xl font-bold text-purple-700 mb-8">Dashboard</h1>
      {accounts?.find((account) => account.isDefault) && (
        <BudgetComponent
          initialBudget={budgetData?.budget}
          currentExpenses={budgetData?.currentExpenses || 0}
        />
      )}

      {/* Overview */}
      <DashboardOverview accounts={accounts} transactions={transactions || []} />

      {/* Account Grids */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8 mt-8">
        <CreateAccountDrawer>
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed">
            <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full pt-5">
              <Plus className="h-10 w-10 mb-2" />
              <p className="text-sm font-medium">Add New Account</p>
            </CardContent>
          </Card>
        </CreateAccountDrawer>

        {/* Mapping over accounts */}
        {accounts?.length > 0 &&
          accounts.map((item) => <AccountCard key={item.id} account={item} />)}
      </div>
    </div>
  );
}
