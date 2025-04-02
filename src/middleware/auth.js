const jwt = require("jsonwebtoken");
const User = require("../models/user");


const userauth = async(req, res, next) => {
  const token = req.cookies?.token;

  //const token ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2VhODE0YzVlZGYyZDU5ZjVhNjVkZjEiLCJpYXQiOjE3NDM0MjI2ODcsImV4cCI6MTc0MzQyNjI4N30.JitH9FikC0JlfVrR-_LjYb2KUZwPdvMK1D7BoxXtBjY'
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }
  console.log("Received Token:", token);


  try {
    const decoded = jwt.verify(token, "secret");
    const { _id } = decoded;
console.log("Logged in user ID:", _id);
const user = await User.findById(_id);
if (!user) {
    throw new Error("User not found");
  }

  req.user = user;

    
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = userauth; // Ensure this is exported correctly
