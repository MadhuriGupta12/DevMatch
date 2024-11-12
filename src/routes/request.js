const express=require("express");
const requestRouter=express.Router();
const {adminAuth}=require("../middlewares/auth.js");
const User=require("../models/user");
const ConnectionRequest=require("../models/connectionRequest.js");

//status kya bhej rhe hai aur kis user ko bhej rahe hai
requestRouter.post("/request/send/:status/:toUserId",adminAuth,async(req,res)=>{
    try{
        const fromUserId=req.user._id;
        const toUserId=req.params.toUserId;
        const status=req.params.status;
        const allowedStatus=["ignored","interested"];
        if(!allowedStatus.includes(status) ){
            return res.status(480).json({message: "invalid status"+status});
        }

 //DB me jiska id store hoga usi ke pass request jayega
        const toUser=await User.findById(toUserId);
        if(!toUser){
            return res.status(405).json({message:"user not found"});
        }
        //ek baar request bhejne ke baad baar baar nhi bhej sakte and opposite side se request le bhi nhi sakte
        const existingConnectionRequest=await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId},
            ],
        });
        if(existingConnectionRequest){
            return res.status(400).send({message:"connection already exist"});
        }
     //coonection sara DB me save hoga
        const connectionRequest=new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
        });

        const data=await connectionRequest.save();
        //output dikhayega
        res.json({
            message:
            req.user.firstName + "  is  "+ status + "  in  " + toUser.lastName,
            data,
        })
    }catch(err){
        res.status(400).send("kuch error : "+err.message);
    }
});
module.exports=requestRouter;