import { currentUser } from "@clerk/nextjs/server";
import { db_Var } from "@/lib/prisma";

export async function GET(req) {
  try {
    const userDetails = await currentUser();
    if (!userDetails) return Response.json(null);

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

    return Response.json(user);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
