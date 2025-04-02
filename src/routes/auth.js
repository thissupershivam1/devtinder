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

        // Save user to the database
        await user.save();
        return res.status(201).json({ message: "User created successfully" });

    } catch (err) {
        console.error("Error during user signup:", err);
        return res.status(500).json({ error: "Internal server error. Please try again later." });
    }
});

authrouter.post("/login", async (req, res) => {
    try {
        // Input validation
        const { email, password } = req.body;
        validateLoginData(req.body);

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Compare passwords
        const isMatch =  bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        if (isMatch) {
            // Create a JWT token
            const token = await user.getJWT();
            console.log("Generated Token:", token);
          
            // Add token to cookies and ensure it's properly set
            res.cookie("token", token, { httpOnly: true, secure: false });
            return res.status(200).json({ message: "Login successful" });
          }
          
        

        // Authentication successful, return a response (JWT token can be added here later)
        return res.status(200).json({ message: "Login successful" });

    } catch (err) {
        console.error("Error during user login:", err);
        return res.status(500).json({ error: "Internal server error. Please try again later." });
    }
});

module.exports=authrouter;