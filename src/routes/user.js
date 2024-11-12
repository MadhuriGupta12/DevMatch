const express=require("express");
const userRouter=express.Router();

const {adminAuth}=require("../middlewares/auth")
const ConnectionRequest=require("../models/connectionRequest");

userRouter.get("/user/requests/pending",adminAuth,async(req,res)=>{
    try{
        const loggedInUser=req.user;

        const connectionRequests=await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested",
        }).populate(
            "fromUserId",
            "firstName lastName "
        );
        res.json({
            message:"data fetch ho gya",
            data:connectionRequests,
        });
    }catch(err){
        res.status(408).send("error  :"+err.message);
    }
});
module.exports=userRouter;