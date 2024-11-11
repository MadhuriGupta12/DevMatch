const express=require("express");
const profileRouter=express.Router();
const {adminAuth}=require("../middlewares/auth.js");
const{validateEditProfileData}=require("../utils/validation.js")

profileRouter.get("/profile/view",adminAuth,async(req,res)=>{
    try{
        const user=req.user;
    res.send(user);
    }catch(err){
    res.status(400).send("kuch error");
    } 
});
profileRouter.patch("/profile/edit",adminAuth,async(req,res)=>{
    try{
       if(! validateEditProfileData(req)){
        throw new Error("edit not allowed");
       }
       const loggedInUser=req.user;
       Object.keys(req.body).forEach((key)=>(loggedInUser[key]=req.body[key]));
       await loggedInUser.save();
       res.send("edit was succesfull");
    }catch(err){
        res.status(400).send("kuch error : "+err.message);
    }
})
module.exports=profileRouter;
