const mongoose = require("mongoose");

const connectDB = async () => {
    const URI=process.env.MONGO_URI
    const conn = await mongoose.connect(URI, {
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
};

module.exports = connectDB;

