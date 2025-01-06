import { Card } from "@repo/ui/card"

export const P2Ptxns=({P2P}:{
    P2P:{
        time :Date,
        amount:number
    }[]
})=>{
    if(!P2P.length){
        return <Card title={"Recent Transactions"}>
            <div className="text-center pb-8 pt-8">
                No Recent Transaction
            </div>
        </Card>
    }
    return <Card title={"Recent Transactions"}>
        <div>
            {P2P.map(p=> <div className="flex justify-between">
                <div>
                    Received INR
                </div>
                <div className="text-slate-600 text-xs">
                    {p.time.toDateString()}
                </div>
                <div className="flex flex-col justify-center">
                    +Rs {p.amount /100}
                </div>
            </div> 
        )}
        </div>
    </Card>
}