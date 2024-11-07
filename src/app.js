const express=require("express");
const app=express();
require("./config/database");
app.use(express.json());
const User=require("./models/user");
//added the new data
app.post("/signup",(req,res)=>{

    const user= new User(req.body);
    try{
        user.save();
        res.send("all data stored");
    }catch(err){
        res.status(404).send("something are error"+err.message);
    }
});

   //get the data
app.get("/user",async(req,res)=>{
    const userEmail=req.body.email;
    try{
    const user= await User.findOne({email:userEmail});
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