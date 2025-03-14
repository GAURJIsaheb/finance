"use server";
// Test data for the Accounts Table
import { db_Var } from "@/lib/prisma";
import { subDays } from "date-fns";

const ACCOUNT_ID = "122f319f-8fa9-4e2b-9875-444e0437e8b0"; // Manually added 'Personal' account ID from the Accounts Table
const USER_ID = "f2afd424-007c-4b2b-a3df-92dec42d067e"; // User ID from the usersTable

// Categories with typical amount ranges
const CATEGORIES = {
  INCOME: [
    { name: "salary", range: [5000, 8000] },
    { name: "freelance", range: [1000, 3000] },
    { name: "investments", range: [500, 2000] },
    { name: "other-income", range: [100, 1000] },
  ],
  EXPENSE: [
    { name: "housing", range: [1000, 2000] },
    { name: "transportation", range: [100, 500] },
    { name: "groceries", range: [200, 600] },
    { name: "utilities", range: [100, 300] },
    { name: "entertainment", range: [50, 200] },
    { name: "food", range: [50, 150] },
    { name: "shopping", range: [100, 500] },
    { name: "healthcare", range: [100, 1000] },
    { name: "education", range: [200, 1000] },
    { name: "travel", range: [500, 2000] },
  ],
};

// Helper to generate random amounts within a range
function getRandomAmount(min, max) {
  return Number((Math.random() * (max - min) + min).toFixed(2));
}

// Helper to get random category with amount
function getRandomCategory(type) {
  const categories = CATEGORIES[type];
  const category = categories[Math.floor(Math.random() * categories.length)];
  const amount = getRandomAmount(category.range[0], category.range[1]);
  return { category: category.name, amount };
}

export async function seedTransactions() {
    try {
      // Generate 90 days of transactions
      const transactions = [];
      let totalBalance = 0;
  
      for (let i = 90; i >= 0; i--) {
        const date = subDays(new Date(), i);
  
        // Generate 1-3 transactions per day
        const transactionsPerDay = Math.floor(Math.random() * 3) + 1;
  
        for (let j = 0; j < transactionsPerDay; j++) {
          // 40% chance of income, 60% chance of expense
          const type = Math.random() < 0.4 ? "INCOME" : "EXPENSE";
          const { category, amount } = getRandomCategory(type);
  
          const transaction = {
            id: crypto.randomUUID(),
            type,
            amount,
            description: `${
              type === "INCOME" ? "Received" : "Paid for"
            } ${category}`,
            date,
            category,
            status: "COMPLETED",
            userId: USER_ID,
            accountId: ACCOUNT_ID,
            createdAt: date,
            updatedAt: date,
          };
  
          totalBalance += type === "INCOME" ? amount : -amount;
          transactions.push(transaction);
        }
      }
  
      // Use Prisma to insert transactions and update account balance
      await db_Var.$transaction(async (tx) => {
        // Clear existing transactions
        await tx.TransactionTable_Var.deleteMany({
          where: { accountId: ACCOUNT_ID },
        });
  
        // Insert new transactions
        await tx.TransactionTable_Var.createMany({
          data: transactions,
        });
  
        // Update account balance
        await tx.accountsTable_Var.update({
          where: { id: ACCOUNT_ID },
          data: { balance: totalBalance },
        });
      });
  
      return {
        success: true,
        message: `Created ${transactions.length} transactions`,
      };
    } catch (error) {
      console.error("Error seeding transactions:", error);
      return { success: false, error: error.message };
    }
  }
  