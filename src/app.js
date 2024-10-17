const express = require("express");
const app = express();
const auth = require("./middleware/auth");
const connectDB=require("./config/database");
const User = require("./models/user");

app.post("/signup", async (req, res) => {

    const user = new User({
        firstName: "Shivam",
        lastName: "Maurya",
        email: "s6v5t@example.com",
        password: "password",
        age: 22,
        gender: "male",
       
    });
    try{
        await user.save();
        res.send("User created Successfully");  
    }
    catch(err){
        console.log(err);
    }
    
});
connectDB().then(() => {
    console.log("Database connected");
    app.listen(7777, () => {
        console.log("Listening on port 7777");
    });
}).catch((err) => {
    console.log(err);
});

