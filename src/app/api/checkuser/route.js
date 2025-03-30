import { db_Var } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(req) {
  try {
    const userDetails = await currentUser();
    //console.log("User Details:", userDetails);

    if (!userDetails) return new Response(null);

    let user = await db_Var.usersTable_Var.findUnique({
      where: { clerkUserId: userDetails.id },
    });

    //console.log("Existing User:", user);

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
      //console.log("New User Created:", user);
    }

    return new Response(JSON.stringify(user), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
