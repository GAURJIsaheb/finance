"use client"
import React, { useState, useEffect, useMemo } from 'react';
import { useDebounce } from 'use-debounce';
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowUpDown, Clock, DollarSign, MoreHorizontal, RefreshCw, RotateCcw, Search, Trash2, X } from 'lucide-react';
import { categoryColors } from '@/data/category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';

function Transactiontable({ transactions }) {




  const Router = useRouter();
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    field: "date",
    direction: "desc",
  });

  const [searchterm, setSearchterm] = useState("");
  const [typeFilter, settypeFilter] = useState("");
  const [recurringFilter, setrecurringFilter] = useState("");

  // Memoized Filtering and Sorting
  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];

    // Apply Search Filter
    if (searchterm) {
      const searchLower = searchterm.toLowerCase();
      result = result.filter((transaction) => 
        transaction.description?.toLowerCase().includes(searchLower)
      );
    }

    // Apply Type Filter
    if (typeFilter) {
      result = result.filter((transaction) => transaction.type === typeFilter);
    }

    // Apply Recurring Filter
    if (recurringFilter) {
      result = result.filter((transaction) =>
        recurringFilter === "recurring" ? transaction.isRecurring : !transaction.isRecurring
      );
    }

    // Apply Sorting
    result.sort((a, b) => {
      if (sortConfig.field === "date") {
        return sortConfig.direction === "asc"
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      }
      if (sortConfig.field === "amount") {
        return sortConfig.direction === "asc" ? a.amount - b.amount : b.amount - a.amount;
      }
      if (sortConfig.field === "description") {
        return sortConfig.direction === "asc"
          ? a.description.localeCompare(b.description)
          : b.description.localeCompare(a.description);
      }
      return 0;
    });

    return result;
  }, [transactions, searchterm, typeFilter, recurringFilter, sortConfig]);

  const handleSort = (field) => {
    setSortConfig((current) => ({
      field,
      direction: current.field === field && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortConfig.field === 'date') {
      return sortConfig.direction === 'asc'
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    }
    if (sortConfig.field === 'amount') {
      return sortConfig.direction === 'asc'
        ? a.amount - b.amount
        : b.amount - a.amount;
    }
    if (sortConfig.field === 'status') {
      return sortConfig.direction === 'asc'
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status);
    }
    if (sortConfig.field === 'description') {
      return sortConfig.direction === 'asc'
        ? a.description.localeCompare(b.description)
        : b.description.localeCompare(a.description);
    }
    return 0;
  });


  const handleCheckboxChange = (id) => {
    setSelectedTransactions((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );
  };

  //Delete of Selected Items Function
  const handleBulkDelete=()=>{}
  const clearAllFilters=()=>{
    setSearchterm("");
    settypeFilter("");
    setrecurringFilter("");
    setSelectedTransactions([]);
  }

  const RECURRING_INTERVALS = {
    DAILY: "Daily",
    WEEKLY: "Weekly",
    MONTHLY: "Monthly",
    YEARLY: "Yearly",
  };

  // const deleteFn = (id) => {
  //   console.log(`Transaction with ID: ${id} deleted.`);
  //   const updatedTransactions = transactions.filter((transaction) => transaction.id !== id);
  // };

  return (
    <div className="w-full max-w-screen-xl mx-auto space-y-8">
      {/* Filter */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
          <Input className="pl-8"
            placeholder="Search Transactions.."
            value={searchterm}
            onChange={(e) => setSearchterm(e.target.value)} />
        </div>
        <div className="flex gap-4">
          <Select value={typeFilter} onValueChange={(value) => settypeFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INCOME">Income</SelectItem>
              <SelectItem value="EXPENSE">Expense</SelectItem>
            </SelectContent>
          </Select>

          <Select value={recurringFilter} onValueChange={(value) => setrecurringFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Transactions" />
            </SelectTrigger>
            <SelectContent>
      
              <SelectItem value="recurring">Recurring Only</SelectItem>
              <SelectItem value="non-recurring">Non-Recurring</SelectItem>
            </SelectContent>
          </Select>

          {selectedTransactions.length > 0 && (
            <div>
              <Button className="bg-red-700" onClick={handleBulkDelete}>
                <Trash2 className="h-4 w-4 mr-3"/>
                Delete ({selectedTransactions.length}) Items</Button>
            </div>
          )}

          {(searchterm||typeFilter||recurringFilter) &&
            (<Button 
              variant="outline" 
              size="icon"
              onClick={clearAllFilters}
              title="Clear Filters"
            ><X className="h-4 w-4"/></Button>)
          }
        </div>
      </div>
      <div className="relative w-full">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-indigo-500/10 to-blue-500/10 rounded-xl blur-xl"></div>
        <Table className="w-full rounded-xl overflow-hidden shadow-[0_0_40px_rgba(139,92,246,0.1)] backdrop-blur-sm border border-purple-500/20 relative">
          <TableCaption className="text-black mb-6 text-lg font-semibold pulsing-text">
            Premium Transaction Analytics
          </TableCaption>

          <TableHeader className="bg-gradient-to-r from-slate-900 via-purple-900/90 to-slate-900 border-b border-purple-500/30 ">
            <TableRow>
              <TableHead className="w-[50px] text-purple-100 font-bold py-6 text-base" onClick={() => handleSort('select')}>
                Select
              </TableHead>
              <TableHead className="w-[100px] text-purple-100 font-bold py-6 text-base" onClick={() => handleSort('description')}>
                Description
              </TableHead>
              <TableHead className="text-purple-100 pl-8 font-bold text-base cursor-pointer" onClick={() => handleSort('date')}>
                Date {sortConfig.field === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead className="text-purple-100 font-bold text-base cursor-pointer" onClick={() => handleSort('status')}>
                Status
              </TableHead>
              <TableHead className="text-right text-purple-100 font-bold pr-8 text-base cursor-pointer" onClick={() => handleSort('amount')}>
                Amount {sortConfig.field === 'amount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead className="text-right text-purple-100 font-bold text-base pr-28 cursor-pointer" onClick={() => handleSort('recurring')}>
                Recurring
              </TableHead>
              <TableHead className="text-right text-purple-100 pr-16 font-bold text-base">
                Options
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="bg-gradient-to-br from-slate-900/95 via-slate-900/98 to-slate-900/95">
            {filteredAndSortedTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-white py-8">
                  No Transactions Found
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedTransactions.map((invoice) => (
                <TableRow key={invoice.id} className="border-b border-purple-500/10 hover:bg-purple-500/5 transition-all duration-300 group">
                  <TableCell className="text-center">
                    <Checkbox
                      className="border-2 border-white font-bold focus:ring-2 checked:bg-white checked:border-blue-500"
                      checked={selectedTransactions.includes(invoice.id)}
                      onCheckedChange={() => handleCheckboxChange(invoice.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium text-gray-100 py-5 group-hover:text-purple-300">{invoice.description}</TableCell>
                  <TableCell className="text-gray-300 pl-6 group-hover:text-purple-300">
                    {/* Here use the time element with suppressHydrationWarning */}
                    <time dateTime={invoice.date} suppressHydrationWarning>
                      {format(new Date(invoice.date),"PP")}
                    </time>
                  </TableCell>
                  <TableCell className="capitalize">
                    <span style={{ background: categoryColors[invoice.category] || "#ccc" }} className="px-2 py-1 rounded">
                      {invoice.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    <span className={`inline-flex items-center mr-8 justify-end gap-1 ${invoice.type === "EXPENSE" ? "text-red-400" : "text-green-400"}`}>
                      <DollarSign className="h-4 w-4 text-current" /> {invoice.amount}
                    </span>
                  </TableCell>
                  <TableCell className="pl-32">
                    {invoice.isRecurring ?(
                          <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Badge className="gap-1 bg-red-600">
                                <RefreshCw className="h-3 w-3"/>
                                  {RECURRING_INTERVALS[invoice.recurringInterval]}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent className="bg-lime-400 text-black font-medium">
                              <div>
                                <div>Next Date:</div>
                                  <div>{format(new Date(invoice.nextRecurringDate),"PP")}</div>

                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                    ):(
                        <Badge className="gap-1">
                          <RotateCcw className="h-3 w-3"/>
                            One-Time
                        </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Edit Transaction</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => Router.push(`/edit/${invoice.id}`)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteFn(invoice.id)}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          {/* Table Footer */}
          <TableFooter className="w-full bg-gradient-to-r from-slate-900 via-purple-900/90 to-slate-900 border-t border-purple-500/30">
            <TableRow>
              <TableCell colSpan={6} className="text-purple-100 font-bold py-6 text-base">
                Total Balance
              </TableCell>
              <TableCell className="text-right text-purple-100 font-bold text-base">
                <span className="inline-flex items-center justify-end gap-1">
                  <DollarSign className="h-4 w-4" />
                  {transactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}

export default Transactiontable;