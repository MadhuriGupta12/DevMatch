const mongoose=require('mongoose');
const connectedDB= async()=>{

await mongoose.connect("mongodb://127.0.0.1:27017/devMatch");
   // await mongoose.connect(
   //    "mongodb+srv://madhu:<Madhuri@1224@>bagify.uuzjk.mongodb.net/?retryWrites=true&w=majority&appName=bagify"
   // )
}
 connectedDB()
  .then(()=>{
    console.log("databse connectd");
 })

    .catch((err)=>{
    console.error("databse not connectd");
 })