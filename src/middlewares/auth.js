const jwt=require("jsonwebtoken");
const User=require("../models/user");
const adminAuth=async(req,res,next)=>{
    try{
    const {token}=req.cookies;
    if(!token){
        throw new Error("token not found");
    }
    const decodeObj=await jwt.verify(token,"madhuri");
    const {_id}=decodeObj;
    const user=await User.findById(_id);
    if(!user){
        throw new Error("user not found");
    }
    req.user=user;
    next();
}catch(err){
res.status(443).send("ERROR  : "+err.message); 
}
}

module.exports={
    adminAuth,
};