// authMiddleware.js
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  let token = req.header("Authorization");
  if (token) {
    token = token.slice(7);
  }
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      console.log("Token expired || missing token");
    }
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired." });
    }
    return res.status(400).json({ message: "Invalid token." });
  }
};

const authorizeRole = (allowedRoles) => (req, res, next) => {
  let token = req.header("Authorization");
  if (token) {
    token = token.slice(7);
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!allowedRoles.includes(decoded.role)) {
    return res
      .status(403)
      .json({ error: "Bạn không có quyền truy cập API này." });
  }
  next();
};

module.exports = {
  authenticateToken: authenticateToken,
  authorizeRole: authorizeRole,
};
