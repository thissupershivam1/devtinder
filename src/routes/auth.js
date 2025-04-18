const express=require("express");
const authrouter=express.Router();
const {validateSignUpData, validateEditProfileData,validateLoginData} = require("../utils/validator");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userauth = require("../middleware/auth");

authrouter.post("/signup", async (req, res) => {
    try {
        // Input validation
        const { firstName, lastName, email, password } = req.body;
        validateSignUpData(req);
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email is already in use" });
        }

        // Encrypt the password
        const passwordHash = bcrypt.hashSync(password, 10);

        // Create new user instance
        const user = new User({
            firstName,
            lastName,
            email,
            password: passwordHash
        });

        const savedUser = await user.save();
        const token = await savedUser.getJWT();

        res.cookie("token", token, {
            expires: new Date(Date.now() + 8 * 3600000),
          });

        return res.status(200).json( { user: savedUser } );

    } catch (err) {
        console.error("Error during user signup:", err);
        return res.status(500).json({ error: "Internal server error. Please try again later." });
    }
});

authrouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        validateLoginData(req.body);

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // This is the only response needed
        const token = await user.getJWT();
        res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "lax" });
        return res.status(200).json({ user });

    } catch (err) {
        console.error("Error during user login:", err);
        return res.status(500).json({ error: "Internal server error. Please try again later." });
    }
});

authrouter.post("/logout",  async (req, res) => {
    try {
        res.cookie("token", "", {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          expires: new Date(0), // Or use `maxAge: 0`
        });
        return res.status(200).json({ message: "Logout successful" });
    } catch (err) {
        console.error("Error during user logout:", err);
        return res.status(500).json({ error: "Internal server error. Please try again later." });
    }
});

module.exports=authrouter;