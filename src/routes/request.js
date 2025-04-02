const express=require("express");
const requestRouter=express.Router();
const userauth = require("../middleware/auth");
requestRouter.post("/sendconnectionrequest", userauth, async (req, res) => {
    try {
        const user=req.user;
        return res.status(200).json({ message: "Connection request sent successfully"+user.firstName });
    } catch (error) {
        console.error("Error sending connection request:", error);
        return res.status(500).json({ error: "Internal server error. Please try again later." });
    }
});

module.exports=requestRouter;    