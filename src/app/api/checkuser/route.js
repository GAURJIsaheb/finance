"use server";  // Ensures it's treated as a server component
export const dynamic = 'force-dynamic';  // Ensures dynamic rendering for this API route
import { currentUser } from "@clerk/nextjs/server";
import { db_Var } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const userDetails = await currentUser();
    if (!userDetails) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let user = await db_Var.usersTable_Var.findUnique({
      where: { clerkUserId: userDetails.id },
    });

    if (user) return NextResponse.json(user);

    const name = `${userDetails.firstName} ${userDetails.lastName}`;
    const newUser = await db_Var.usersTable_Var.create({
      data: {
        clerkUserId: userDetails.id,
        name,
        imageUrl: userDetails.imageUrl || "",
        email: userDetails.emailAddresses?.[0]?.emailAddress || "",
      },
    });

    return NextResponse.json(newUser);
  } catch (error) {
    console.error("Error in CheckUser API:", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
