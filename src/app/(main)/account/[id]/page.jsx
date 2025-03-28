import { getAccountTransactions, updateDefaultAccount } from '@/Serveractions/accountsAction';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react';
import Transactiontable from '@/app/(main)/account/transactionsTable/transactiontable';
import { BarLoader } from 'react-spinners';
import AccountChart from '../accountchart/accountchart';


// 🚀 Force dynamic rendering (prevents build-time errors)
export const dynamic = "force-dynamic";
// Fetch data in a separate function
async function fetchAccountData(id) {
    try {
        const accountData = await getAccountTransactions(id);
        await updateDefaultAccount(id);

        if (!accountData) notFound(); // Trigger 404 if no data

        return accountData;
    } catch (error) {
        console.error("Error loading account data:", error);
        notFound();  // Trigger 404 page on error
    }
}

export default async function Account({ params }) {
    const accountData = await fetchAccountData(params.id);
    if (!accountData) return null; // Prevents further execution if no data

    const { transactions, ...account } = accountData;

    return (
        <div className="flex-col">
            <div className=" space-y-8 px-5 py-24">
                {/* Personal Account Details at Top */}
                <div className="flex gap-4 items-end justify-between">
                    <div>
                        <h1 className="text-5xl sm:text-6xl font-bold capitalize bg-gradient-to-r from-yellow-600 via-green-500 to-indigo-400 bg-clip-text text-transparent">
                        {account.name}
                        </h1>
                        <p className="text-muted-foreground">{account.type.charAt(0) + account.type.slice(1).toLowerCase()} Account</p>
                    </div>

                    <div className="text-right pb-2 pt-1">
                        <div className="text-xl sm:text-2xl font-bold">
                            ${parseFloat(account.balance).toFixed(2)}
                            <p className="text-sm text-muted-foreground">{account._count.transactions} Transactions</p>
                        </div>
                    </div>
                </div>

                {/* Chart Section */}
                <Suspense fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea"/>}>
                    <AccountChart transactions={transactions} />
                </Suspense>

                {/* Transaction Table Below */}
                <Suspense fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea"/>}>
                    <Transactiontable transactions={transactions} account={account} />
                </Suspense>
            </div>
        </div>
    );
}
