const express = require("express");
const app = express();
const auth = require("./middleware/auth");
const connectDB=require("./config/database");
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {

    console.log(req.body);

    const user = new User(req.body); 
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

