import { currentUser } from "@clerk/nextjs/server";
import { db_Var } from "@/lib/prisma";

export const checkuser=async()=> {

    const userDetails = await currentUser();
    if (!userDetails) return null;

    try {
    let user = await db_Var.usersTable_Var.findUnique({
      where: { clerkUserId: userDetails.id },
    });
    if(user){
      return user;
    }
      //if user is not found
      const name = `${userDetails.firstName} ${userDetails.lastName}`;
      const new_user = await db_Var.usersTable_Var.create({
        data: {
          clerkUserId: userDetails.id,
          name,
          imageUrl: userDetails.imageUrl || "",
          email: userDetails.emailAddresses?.[0]?.emailAddress || "",
        },
      });

    return new_user;
  } catch (error) {
    console.log("Error in CheckUser API:", error.message);

  }
}
