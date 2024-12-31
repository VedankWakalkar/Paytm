import express from "express";

const app= express();

app.post("/hdfcWebhook",(req,res)=>{
    const paymentInfo={
        token:req.body.token,     
        amount:req.body.amount,
        userId:req.body.user_identifier
    }
})