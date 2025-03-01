import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db_Var } from "@/lib/prisma";

export async function GET() {
  try {
    const userDetails = await currentUser();
    if (!userDetails) return NextResponse.json(null);

    let user = await db_Var.usersTable_Var.findUnique({
      where: { clerkUserId: userDetails.id },
    });

    if (!user) {
      const name = `${userDetails.firstName} ${userDetails.lastName}`;
      user = await db_Var.usersTable_Var.create({
        data: {
          clerkUserId: userDetails.id,
          name,
          imageUrl: userDetails.imageUrl || "",
          email: userDetails.emailAddresses?.[0]?.emailAddress || "",
        },
      });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error in CheckUser API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
