const express=require("express");
const profileRouter=express.Router();
const userauth = require("../middleware/auth");
profileRouter.get("/profile", userauth, async (req, res) => {
    try {
        const user =req.user;  
    return res.status(200).json(user);
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(401).json({ error: "Invalid or expired token" });
    }   
    });

module.exports=profileRouter;    