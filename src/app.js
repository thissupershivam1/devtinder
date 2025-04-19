const express = require("express");
const app = express();
const connectDB = require("./config/database");
const authrouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const initializeSocket = require("./utils/socket");
const cors=require("cors")
const cookieParser = require("cookie-parser");
const http = require("http");
const chatRouter = require("./routes/chat");

// ✅ Move middleware before routes
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}));
app.use(express.json());  // Parses incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data
app.use(cookieParser());

// ✅ Now define routes
app.use("/", authrouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);



const server = http.createServer(app);
initializeSocket(server);

connectDB()
  .then(() => {
    console.log("Database connected");
    server.listen(7777, () => {
      console.log("Listening on port 7777");
    });
  })
  .catch((err) => {
    console.log(err);
  });
