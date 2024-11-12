const mongoose=require("mongoose");
const { applyTimestamps } = require("./user");
const connectionRequestSchema=new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User", //referance karega (routs ke user me jayega ) data jaise name lastname sb print hoga
        required:true,
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    status:{
        type:String,
        required:true,
        enum:{
        values:["ignored","interested","accepted","rejected"],
        message:`{VALUE} is incorrect status`
        },
    },
},
{timestamps:true,}
);

//DB me save hone se pahle notify karna
connectionRequestSchema.pre("save",function(next){
const connectionRequest=this;
//agar kuch ko hi request kare to
if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
    throw new Error("can not send to yourself");
}
next();
})
const connectionRequestModel=new mongoose.model("connectionRequest",connectionRequestSchema);
module.exports=connectionRequestModel; 