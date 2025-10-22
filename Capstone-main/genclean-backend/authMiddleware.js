const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET || "yoursecret";

function requireAuth(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    try {
        const payload = jwt.verify(token, SECRET);
        req.user = payload;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

module.exports = requireAuth;
