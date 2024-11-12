 const mongoose=require("mongoose");
 const validator=require("validator");
 const bcrypt=require("bcrypt");
 const jwt = require("jsonwebtoken");
 const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        require:true,
        minLength:3,
        maxLength:25,
    },
    lastName:{
        type:String,
    },
    emailId:{
        type:String,
        require:true,
        unique:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("invalid email");
            }
        },
    },
    password:{
        type:String,
        require:true,
    },
    age:{
        type:Number,
        min:18,
    },
    gender:{
        type:String,
        enum:{
            values:["male","female","other",],
            message:`{VALUE} is not a gender`
            },
        // validate(value){
        //     if(!["male","female","other"].includes(value)){
        //         throw new Error("gender data is not valid");
        //     }
       // },
    },
    photourl:{
        type:String,
    },
    about:{
        type:String,
    },
    skill:{
        type:[String]
    },
   },
    {
        timestamps:true,
    }
 ); 
 userSchema.methods.getJWT=async function(){
    const user=this;
    const token = await jwt.sign({_id:user._id},"madhuri" ,{
        expiresIn:"365d",
    });
    return token;
 }
 userSchema.methods.validatePassword=async function (passwordInputByUser){
    const user=this;
    const passwordHash=user.password;
    const isPasswordValid=await bcrypt.compare(
        passwordInputByUser,
        passwordHash
    );
    return isPasswordValid;
 }
 const userModel=mongoose.model("user",userSchema);
 module.exports=userModel;