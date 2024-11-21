// authMiddleware.js
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");
  console.log("Authenticating: ", token);
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded.role: ", decoded.role);

    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token." });
  }
};

const authorizeRole = (allowedRoles) => (req, res, next) => {
  const token = req.header("Authorization");
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log("decoded token: ", decoded.role);
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
