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
      return { success: false, message: "User not authenticated" };
    }

    // Find the recipient user by phone number
    const toUser = await prisma.user.findFirst({ where: { number: to } });
    if (!toUser) {
      return { success: false, message: "Recipient user not found" };
    }

    // Ensure recipient balance exists
    await prisma.balance.upsert({
      where: { userId: Number(toUser.id) },
      update: {},
      create: {
        amount: 0,
        locked: 0,
        userId: Number(toUser.id),
      },
    });

    // Execute the transaction
    await prisma.$transaction(async (tx) => {
      // Check sender's balance
      const fromBalance = await tx.balance.findUnique({
        where: { userId: Number(from) },
      });

      if (!fromBalance || fromBalance.amount < amount) {
        throw new Error("Insufficient funds");
      }

      // Deduct amount from sender
      await tx.balance.update({
        where: { userId: Number(from) },
        data: { amount: { decrement: amount } },
      });

      // Add amount to recipient
      await tx.balance.update({
        where: { userId: Number(toUser.id) },
        data: { amount: { increment: amount } },
      });

      // update the entry in p2p transaction
      await tx.p2pTransfer.create({
        data: {
            fromUserId: Number(from),
            toUserId: toUser.id,
            amount,
            timestamp: new Date()
        }
      })

    });

    return { success: true, message: "Transfer successful" };
  } catch (error: any) {
    console.error("Error during P2P transfer:", error.message);
    return { success: false, message: error.message || "An unexpected error occurred" };
  }
}
