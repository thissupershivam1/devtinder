const jwt = require("jsonwebtoken");
const User = require("../models/user");


const userauth = async(req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }
  try {
    const decoded = jwt.verify(token, "secret");
    const { _id } = decoded;
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
