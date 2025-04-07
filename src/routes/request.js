const express=require("express");
const requestRouter=express.Router();
const userauth = require("../middleware/auth");
const ConnectionRequest =require("../models/connectionRequest")
const User = require("../models/user");
requestRouter.post("/request/send/:status/:toUserId", userauth, async (req, res) => {
    try {
        const fromUserId=req.user._id;
        const toUserId=req.params.toUserId;
        const status=req.params.status;

        const allowedStatus = ["ignored", "interested"];
        if (!allowedStatus.includes(status)) {
          return res
            .status(400)
            .json({ message: "Invalid status type: " + status });
        }

        const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "User not found!" });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: "Connection Request Already Exists!!" });
      }

        const connectionRequest= new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        const data = await connectionRequest.save();
        res.json({
            message:"Connection Request sent successfully",
            data
        })
        
    } catch (error) {
        console.error("Error sending connection request:", error);
        return res.status(500).json({ error: "Internal server error. Please try again later." });
    }
    return res.status(200).json({ message: "Connection request sent successfully"});
});

requestRouter.post("/request/review/:status/:requestId",userauth, async (req, res) => {
  
  try{
    const loggedInUser= req.user;
    const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ messaage: "Status not allowed!" });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection request not found" });
      }
      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.json({ message: "Connection request " + status, data });

  } catch (error) {
    console.error("Error sending connection request:", error);
    return res.status(500).json({ error: "Internal server error. Please try again later." });
  }
});
module.exports=requestRouter;    