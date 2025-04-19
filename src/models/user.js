const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"],
        trim: true,
        minlength: [2, "First name must be at least 2 characters long"],
        maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
        trim: true,
        minlength: [2, "Last name must be at least 2 characters long"],
        maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
    },
    age: {
        type: Number,
        min: [18, "Age must be at least 18"],
        max: [100, "Age cannot exceed 100"],
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        
    },
    photoUrl: {
        type: String,
        default: "https://geographyandyou.com/images/user-profile.png",
      },
      about: {
        type: String,
        default: "This is a default about of the user!",
      },
    skills: {
        type: [String], // Array of strings
        
    },
}, { 
    timestamps: true // Adds createdAt and updatedAt fields
});

userSchema.methods.getJWT = function () {
    return jwt.sign({ _id: this._id }, "secret", { expiresIn: "7d" });
};

module.exports = mongoose.model("User", userSchema);
