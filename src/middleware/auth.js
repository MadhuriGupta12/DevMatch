const adminAuth=(req,res,next)=>{
    const token="xyz";
    const isAuthorized=token==="xyz";
    if(!isAuthorized){
        res.status("402").send("you are frod");
    }else{
        next();
    }
}
module.exports={
    adminAuth,
};