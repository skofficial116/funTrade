import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  // Check if JWT secret is configured
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ 
      success: false, 
      message: "Server configuration error: JWT_SECRET not set" 
    });
  }

  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export default authMiddleware;
