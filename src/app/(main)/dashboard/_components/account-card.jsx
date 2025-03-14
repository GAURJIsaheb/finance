"use client";
import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import useFetch from "../../../../../hooks/use-fetch";
import { updateDefaultAccount } from "@/Serveractions/accountsAction";
import { toast } from "sonner";

function AccountCard({ account }) {
  const { name, type, balance, id, isDefault } = account;

  // Fetch hook with renamed loading state
  const {
    loading: updateDefaultLoading,
    fn: updateDefaultFn,
    data: updateAccount,
    error,
  } = useFetch(updateDefaultAccount);

  const handleDefaultChange = async (event) => {
    event.preventDefault();

    if (isDefault) {
      toast.warning("You have to select at least one account as Default!");
      return;
    }

    if (updateDefaultLoading) return; // Prevent multiple clicks

    await updateDefaultFn(id);
  };

  // Handle success
  useEffect(() => {
    if (updateAccount?.success) {
      toast.success("Default Account Updated Successfully!");
    }
  }, [updateAccount, updateDefaultLoading]);

  // Handle error
  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to Update Default Account!");
    }
  }, [updateAccount, updateDefaultLoading]);

  return (
    <Card className="hover:shadow-lg  transition-shadow group relative bg-gradient-to-br from-yellow-400 to-white">
      <Link href={`/account/${id}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium capitalize">{name}</CardTitle>
          <div className="relative">
            <Switch
              checked={isDefault}
              onClick={handleDefaultChange}
              disabled={updateDefaultLoading}
              className={updateDefaultLoading ? "opacity-50 cursor-not-allowed" : ""}
            />
            {updateDefaultLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-4 w-4 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${parseFloat(balance).toFixed(2)}</div>
          <p className="text-xs text-muted-foreground capitalize">
            {type.charAt(0) + type.slice(1).toLowerCase()} Account
          </p>
        </CardContent>
        <CardFooter className="flex justify-between px-6 pb-6 pt-2">
          <div className="flex items-center gap-2 text-green-400 group-hover:scale-110 transition-transform">
            <ArrowUpRight className="h-5 w-5 animate-bounce" />
            <span className="text-sm font-medium">Income</span>
          </div>
          <div className="flex items-center gap-2 text-red-400 group-hover:scale-110 transition-transform">
            <ArrowDownRight className="h-5 w-5 animate-bounce" />
            <span className="text-sm font-medium">Expense</span>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}

export default AccountCard;
