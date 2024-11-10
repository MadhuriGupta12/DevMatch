const express=require("express");
const app=express();
require("./config/database");
app.use(express.json());
const User=require("./models/user");
const bcrypt=require("bcrypt");
 const {validateSignUpData}=require("./utils/validation");
 const cookieParser=require("cookie-parser");
 app.use(cookieParser());
const jwt=require("jsonwebtoken");
const {userAuth}=require("./middleware/auth");
//added the new data
app.post("/signup",async(req ,res)=>{
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

app.post("/login",async(req,res)=>{
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

app.get("/profile",async(req,res)=>{
    try{
        const user=req.user;
    res.send(user);
    }catch(err){
    res.status(400).send("kuch error");
    } 
})
   //get the data
app.get("/user",async(req,res)=>{
    const userEmail=req.body.emailId;
    try{
    const user= await User.findOne({emailId:userEmail});
    if(user.length===0){
        res.status(403).send("kuch error hai");
    }else{
        res.send(user);
    }
   }catch(err){
    res.status(400).send("kuch error");
   } 
});

app.delete("/delete",async(req,res)=>{
    const userid=req.body.userId;
    try{
    const user= await User.findByIdAndDelete(userid);
        res.send("delete succesfull");
   }catch(err){
    res.status(400).send("kuch error");
   } 
});

app.patch("/update:userId",async(req,res)=>{
    // user id ni bhi raha to update ho jayega
    const userId=req.params?.userId;
    const data=req.body;

    const ALLOWED_UPDATES=["firstName","age","lastName","skill","gender","photourl","about"];
    const isUpdatedAllowed=object.keys(data).every((k)=>
        ALLOWED_UPDATES.includes(k)
    );
    if(!isUpdatedAllowed){
        res.status(405).send("update not allowed")
    }
    if(data?.skill.length >10){
        throw new Error("skill can not grater than 10")
    }
    try{
    const user=await User.findByIdAndUpdate({_id:userId},data,{
    returnDocument:"after",
    runValidators:true,
    });
    console.log(user);
        res.send("your data is updated");
    }catch(err){
    res.status(400).send("kuch error"+err.message);
   } 
});

app.get("/feed",async(req,res)=>{
    try{
    const user= await User.find({}); 
        res.send(user);
   }catch(err){
    res.status(400).send("kuch error");
   } 
});
app.listen(3000);