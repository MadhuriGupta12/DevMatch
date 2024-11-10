const validator=require("validator")
const validateSignUpData=(req)=>{
    const{ firstName,lastName, emailId,password}=req.body;
    if(!firstName  || !lastName){
        throw new Error("name is invalid");
    }else if(!validator.isEmail(emailId)){
        throw new Error("email is invalid");
    }else if(!validator.isStrongPassword(password)){
        throw new Error("please enter strong password");
    }
};

module.exports={validateSignUpData};
