const express=require("express");
const app=express();
const {adminAuth}=require("./middleware/auth");

app.use('/admin',adminAuth);
app.use("/admin/find",(req,res,next)=>{
    res.send("information le lo");
});
app.use("/admin/delete",(req,res,next)=>{
    res.send("information delete kr do");
});
app.listen(3000);