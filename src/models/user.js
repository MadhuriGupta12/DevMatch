 const mongoose=require("mongoose");
 const validator=require("validator");
 const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        require:true,
    },
    lastName:{
        type:String,
    },
    email:{
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
        validate(value){
            if(!["male","female","other"].includes(value)){
                throw new Error("gender data is not valid");
            }
        },
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
 const userModel=mongoose.model("user",userSchema);
 module.exports=userModel;