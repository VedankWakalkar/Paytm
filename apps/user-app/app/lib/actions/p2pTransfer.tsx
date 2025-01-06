"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function p2pTransfer(to: string, amount: number) {
  try {
    // Fetch the current session and validate the sender
    const session = await getServerSession(authOptions);
    const from = session?.user?.id;
    if (!from) {
      return { success: false, message: "Error while sending: User not authenticated" };
    }

    // Find the recipient user by phone number
    const toUser = await prisma.user.findFirst({
      where: { number: to },
    });

    if (!toUser) {
        return { success: false, message: "Recipient user not found" };
      }

    const toUserBalance= await prisma.balance.findFirst({
        where:{
            userId:Number(toUser?.id)
        }
    })
    if(!toUserBalance){
        await prisma.balance.create({
            data:{
                amount:0,
                locked:0,
                userId:Number(toUser?.id)
            }
        })
    }

    // Execute the transaction
    await prisma.$transaction(async (tx) => {
      // Check sender's balance
      const fromBalance = await tx.balance.findUnique({
        where: { userId: Number(from) },
      });

      if (!fromBalance || fromBalance.amount < amount) {
        throw new Error("Insufficient funds");
      }
      await new Promise(r => setTimeout(r, 4000));
      // Deduct amount from sender
      await tx.balance.update({ 
        where: { userId: Number(from) },
        data: { amount: { decrement: amount } },
      });
      console.log("passes the deduct request")
      // Add amount to recipient
      await tx.balance.update({
        where: { userId: toUser.id },
        data: { amount: { increment: amount } },
      });   
      console.log("passes the update request")
    });

    return { success: true, message: "Transfer successful" };
  } catch (error: any) {
    console.error("Error during P2P transfer:", error.message);
    return { success: false, message: error.message || "An unexpected error occurred" };
  }
}
