const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authorization header missing or malformed" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.userId) {
      return res.status(403).json({ error: "Invalid token payload" });
    }

    req.userId = decoded.userId;
    console.log("Decoded JWT:", decoded); // Remove in production
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired token" });
  }
}

module.exports = auth;
