"use client"
import React, { useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox"
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
import { ArrowUpDown, Clock, DollarSign, MoreHorizontal, RefreshCw } from 'lucide-react';
import { categoryColors } from '@/data/category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

function Transactiontable({ transactions }) {
  const Router = useRouter();
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const[sortConfig,setSortConfig]=useState({
    field:"date",
    direction:"desc"
  });
  //console.log("--->",selectedTransactions);

  const handleSort = (field) => {
    setSortConfig((current) => ({
      field,
      direction: current.field === field && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };
  
  // Apply sorting logic dynamically
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

  const filteredAndSortedTransactions = sortedTransactions.filter(
    (transaction) => transaction.status === 'COMPLETED'
  );

  const handleCheckboxChange = (id) => {
    setSelectedTransactions((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );
  };

  const RECURRING_INTERVALS = {
    DAILY: "Daily",
    WEEKLY: "Weekly",
    MONTHLY: "Monthly",
    YEARLY: "Yearly",
  };

  //Delete Function
  const deleteFn = (id) => {
    // Perform delete action (e.g., calling an API to delete the transaction)
    console.log(`Transaction with ID: ${id} deleted.`);

    // After deletion, filter out the deleted transaction from the list
    const updatedTransactions = transactions.filter((transaction) => transaction.id !== id);
    // Assuming transactions is a state variable, you'd update it here
    // setTransactions(updatedTransactions);
  };



  return (
    <div className="w-full max-w-screen-xl mx-auto space-y-8">
      <div className="relative w-full">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-indigo-500/10 to-blue-500/10 rounded-xl blur-xl"></div>
        
        <Table className="w-full rounded-xl overflow-hidden shadow-[0_0_40px_rgba(139,92,246,0.1)] backdrop-blur-sm border border-purple-500/20 relative">
          <TableCaption className="text-black mb-6 text-lg font-semibold pulsing-text">
            Premium Transaction Analytics
          </TableCaption>
          
          <TableHeader className="bg-gradient-to-r from-slate-900 via-purple-900/90 to-slate-900 border-b border-purple-500/30">
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
              <TableHead className="text-right text-purple-100 font-bold text-base pr-8 cursor-pointer" onClick={() => handleSort('recurring')}>
                Recurring
              </TableHead>
              <TableHead className="text-right text-purple-100 font-bold text-base">
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
                    {new Date(invoice.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </TableCell>
                  <TableCell className="capitalize">
                    <span style={{ background: categoryColors[invoice.category] }} className="px-2 py-1 rounded">
                      {invoice.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    <span className={`inline-flex items-center mr-8 justify-end gap-1 ${invoice.type === "EXPENSE" ? "text-red-500" : "text-green-500"}`}>
                      {invoice.type === "EXPENSE" ? "- " : "+ "}
                      {invoice.amount.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-6 font-medium text-gray-100 py-5 group-hover:text-purple-300">
                    {invoice.isRecurring ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge className="gap-2 bg-red-500">
                              <RefreshCw className="h-3 w-3" />
                              {RECURRING_INTERVALS[invoice.recurringInterval]}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="bg-green-400 text-black px-4 py-3 rounded-lg shadow-lg animate-fadeIn w-max">
                              <div className="font-semibold mb-1 text-black">Next Date:</div>
                              <div className="text-white text-base">
                                {new Date(invoice.nextRecurringDate).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <Badge className="gap-2">
                        <Clock className="h-3 w-3" />
                        One time
                      </Badge>
                    )}
                  </TableCell>
                   {/*For Delete Drop Down */}
                   <TableCell className="text-right font-medium">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button className="h-8 w-8 mr-4">
                            <MoreHorizontal className="h-4 w-4 text-white"/>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Edit</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => deleteFn(invoice.id)}>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default Transactiontable;
