const express = require("express");
const app = express();
const connectDB = require("./config/database");
const authrouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

const validator = require("validator");
const cookieParser = require("cookie-parser");

// ✅ Move middleware before routes
app.use(express.json());  // Parses incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data
app.use(cookieParser());

// ✅ Now define routes
app.use("/", authrouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("Database connected");
    app.listen(7777, () => {
      console.log("Listening on port 7777");
    });
  })
  .catch((err) => {
    console.log(err);
  });
