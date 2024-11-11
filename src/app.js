const express=require("express");
const app=express();
require("./config/database");
app.use(express.json());
 const cookieParser=require("cookie-parser");
 app.use(cookieParser());
//const jwt=require("jsonwebtoken");

const authRouter=require("./routes/auth");
const profileRouter=require("./routes/profile");
// const requestRouter=require("./routes/request");
app.use("/",authRouter);
app.use("/",profileRouter);

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