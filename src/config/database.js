const mongoose = require("mongoose");

const connectDB = async () => {
    const conn = await mongoose.connect("mongodb+srv://thissupershivam:KHm0AfhXVmQXfVFP@devtinder.8qxqo.mongodb.net/", {
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
};

module.exports = connectDB;

