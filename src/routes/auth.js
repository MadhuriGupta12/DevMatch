const express=require("express");
const authRouter=express.Router();
const {validateSignUpData}=require("../utils/validation");
const User=require("../models/user");
const bcrypt=require("bcrypt");

//added the new data
authRouter.post("/signup",async(req ,res)=>{
    try{
    //validation
     validateSignUpData(req)
     const{firstName,lastName,emailId,password}=req.body;
     //encrypt the password
     const passwordHash=await bcrypt.hash(password,10);
     console.log(passwordHash);
//DB me store hoga
    const user= new User({
        firstName:firstName,
        lastName:lastName,
        emailId:emailId,
        password:passwordHash,
    });
       await user.save();
        res.send("all data stored");
    }catch(err){
        res.status(404).send(" ERROR     :   "+err.message);
    }
});
authRouter.post("/login",async(req,res)=>{
    try{
        const{emailId,password}=req.body;
        const user=await User.findOne({emailId:emailId});
        if(!user){
            throw new Error("email is wrong")
        } 
        const isPasswordValid=await user.validatePassword(password);
        if(isPasswordValid){
            //creat a JWT token
            const token=await user.getJWT();
            res.cookie("token",token,{
                 expires:new Date(Date.now()+8*3600000),
            });
            res.send("sinin succesfull")
        }else{
            throw new Error("password is wrong")
        }
    }catch(err){
        res.status(450).send("Error:  "+err.message);
    }
})

authRouter.post("/logout",async(req,res)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
    });
    res.send("logout succesfull");
});
module.exports=authRouter;