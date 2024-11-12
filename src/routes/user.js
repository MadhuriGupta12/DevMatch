const express=require("express");
const userRouter=express.Router();
const User=require("../models/user")

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

//feed
userRouter.get("/feed",adminAuth,async(req,res)=>{
    try{
        const loggedInUser=req.user;
//kitane log ka ek baar profile dekh sakte hai
        const limit=parseInt(req.query.limit) || 10;
        const page=parseInt(req.query.limit) || 1;
        const skip=(page-1)*limit;
        const connectionRequests=await ConnectionRequest.find({
            $or:[{fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id}
            ],
        }).select("fromUserId toUserId");

        const hideUsersFromFeed=new Set();
        connectionRequests.forEach((req)=>{
            hideUsersFromFeed.add(req.fromUserId);
            hideUsersFromFeed.add(req.toUserId);
        });
       // console.log(hideUsersFromFeed);

        const users=await User.find({
            $and:[
                {_id:{$nin: Array.from(hideUsersFromFeed)}},
                {_id: {$ne: loggedInUser._id}},
            ],
        }).select(USER_SAFE_DATA)
          .skip(skip)
          .limit(limit);

        res.send(users);

    }catch(err){
        res.status(402).json({message:err.message});
    }
});
module.exports=userRouter;