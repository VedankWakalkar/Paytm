import { getServerSession } from "next-auth";
import SendCard from "../../../components/SendMoneyCard";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";
import { P2Ptxns } from "../../../components/P2PTransaction";


async function getP2Ptransfer() {
    const session = await getServerSession(authOptions);
    const p2ptxn=await prisma.p2pTransfer.findMany({
        where:{
            fromUserId:Number(session?.user?.id)
        }
    })
    return p2ptxn.map(p=>({
        time:p.timestamp,
        amount :p.amount,
    }))
}

export default async function(){
    const transactions=await getP2Ptransfer();
    return <div className="w-full flex justify-between">
    {/* hello */}
    <div className="pr-8">
        <SendCard/>
    </div>
    <div className="flex flex-col justify-center w-full">
        <P2Ptxns P2P={transactions} ></P2Ptxns>
    </div>        
    </div> 
}