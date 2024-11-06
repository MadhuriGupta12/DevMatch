const express=require("express");
const app=express();
require("./config/database");
app.use(express.json());
const User=require("./models/user");

app.post("/signup",async(req,res)=>{

    const user= new User(req.body);
    try{
        await user.save();
        res.send("all data is stored");
    }catch(err){
        res.status(404).send("something are error"+err.message);
    }
});



// app.post("/signup", async (req, res) => {
//     try {
//         const { firstName, lastName, email, password } = req.body;
//         const hashedPassword = await bcrypt.hash(password, 10);

//         const user = new User({
//             firstName:"madhuri",
//             lastName:"gupta",
//             email:"madhuri@",
//             password: hashedPassword,
//         });

//         await user.save();
//         res.status(201).send("User successfully stored");
//     } catch (error) {
//         res.status(500).send("An error occurred: " + error.message);
//     }
// });

app.listen(3000);