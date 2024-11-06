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

app.patch("/update",async(req,res)=>{
    const userId=req.body.userId;
    const data=req.body;
    try{
    await User.findByIdAndUpdate({_id:userId},data);
        res.send("your data is updated");
    }catch(err){
    res.status(400).send("kuch error");
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