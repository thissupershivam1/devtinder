const auth = (req, res, next) => {
    const token = "abc";
    if (token) {
        console.log("middlewater called");
        next();
    } else {
        res.status(401).send("Unauthorized");
    }
};

module.exports = auth;