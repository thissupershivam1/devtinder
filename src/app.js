const express = require("express");
const app = express();
const auth = require("./middleware/auth");

app.get("/", auth, (req, res) => {
    res.send("Hello from Express Server!");
});
// app.get("/", (req, res) => {
//     res.send("Hello from Express Server!");
// });

app.get("/test", (req, res) => {
    res.send("Hello from test Express Server!");
});

app.listen(7777, () => {
    console.log("Listening on port 7777");
});