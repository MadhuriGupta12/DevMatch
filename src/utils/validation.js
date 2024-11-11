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
const validateEditProfileData=(req)=>{
    const allowEditFields=["firstName","lastName", "emailId","photourl","gender","age","about","skill"]
   const isEditAllow= Object.keys(req.body).every((field)=>
        allowEditFields.includes(field)
    );
    return isEditAllow;
};
module.exports={
    validateSignUpData,
    validateEditProfileData,
};
