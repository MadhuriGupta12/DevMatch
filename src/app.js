const express=require("express");
const app=express();

app.use('/text',(req,res)=>{
    res.send("hellow");
});
app.use("/",(req,res)=>{
    res.send("tum  ho");
});
app.listen(3000,()=>{
    console.log("hii");
});