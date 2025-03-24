"use client";
import React, { useEffect, useState } from "react";
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
  const [isNavigating, setIsNavigating] = useState(false); // State to track navigation

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

    if (updateDefaultLoading) return;

    await updateDefaultFn(id);
  };

  // Handle navigation loading
  const handleNavigation = (e) => {
    setIsNavigating(true); // Show loading state
    // Simulate navigation delay (remove setTimeout in production if not needed)
    setTimeout(() => setIsNavigating(false), 15000); // Reset after 15s (adjust as needed),,krna nhi aa rha ,,,meko ki page change hoye,,tbh tk Lading ghoye
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
    <div className="relative">
      <Card className="hover:shadow-lg transition-shadow group bg-gradient-to-br from-yellow-400 to-white">
        <Link href={`/account/${id}`} onClick={handleNavigation}>
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

      {/* Sexy Loading Overlay */}
      {isNavigating && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 rounded-lg transition-opacity duration-300">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-transparent border-yellow-400 rounded-full animate-spin mb-4"></div>
            <p className="text-white text-lg font-bold animate-pulse">
              Taking you there...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccountCard;