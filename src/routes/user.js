const express=require("express");
const userRouter=express.Router();

const {adminAuth}=require("../middlewares/auth")
const ConnectionRequest=require("../models/connectionRequest");

const USER_SAFE_DATA="firstName lastName age skill about gender";
//pending connection
userRouter.get("/user/requests/pending",adminAuth,async(req,res)=>{
    try{
        const loggedInUser=req.user;

        const connectionRequests=await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested",
        }).populate("fromUserId",USER_SAFE_DATA);
        res.json({
            message:"data fetch ho gya",
            data:connectionRequests,
        });
    }catch(err){
        res.status(408).send("error  :"+err.message);
    }
});

//connected
userRouter.get("/user/connections",adminAuth,async(req,res)=>{
try{
const loggedInUser=req.user;
const connectionRequests = await ConnectionRequest.find({
    $or:[
        {toUserId: loggedInUser._id ,status:"accepted"},
        {fromUserId: loggedInUser._id ,status:"accepted"},
    ],
})
.populate("fromUserId",USER_SAFE_DATA)
.populate("toUserId",USER_SAFE_DATA);

const data=connectionRequests.map((row)=>{
    //agar khud ko kiye to
    if(row.fromUserId._id.toString()===loggedInUser._id.toString()){
        return row.toUserId;
    }
    return row.fromUserId;
})

}catch(err){
    res.status(408).send("error  :"+err.message);
}
});
module.exports=userRouter;