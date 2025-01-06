"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function creatOnRamptxns(amount :number , provider:string){
    const session =await getServerSession(authOptions);
    const userId= session?.user?.id;
     if(!userId){
        return{
            mesaage:"User not Logged in"
        }
    }

    const userBalance=await prisma.balance.findFirst({
        where:{
            userId:Number(userId)
        }
    })

    if(!userBalance){
        await prisma.balance.create({
            data:{
                userId:Number(userId),
                amount:0,
                locked:0
            }
        })
    }
    
    const token=(Math.random()*100).toString();
    await prisma.onRampTransaction.create({
        data:{
            token:token,
            status:"Processing",
            startTime: new Date(),
            userId: Number(userId),
            provider,
            amount:amount*100
        }
    })
    return {
        message:"Done"
    }
}