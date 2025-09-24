import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authRouter = express.Router();

// Register
authRouter.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.json({ success: false, message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    const safeUser = user.toObject();
    delete safeUser.password;
    res.json({ success: true, message: "User created", user: safeUser });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// Login
authRouter.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if JWT secrets are configured
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ 
        success: false, 
        message: "Server configuration error: JWT_SECRET not set" 
      });
    }

    if (!process.env.REFRESH_SECRET) {
      return res.status(500).json({ 
        success: false, 
        message: "Server configuration error: REFRESH_SECRET not set" 
      });
    }

    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.json({ success: false, message: "Invalid credentials" });

    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // Set refresh token cookie
    const isProd = process.env.NODE_ENV === "production";
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProd, // only secure in production (https)
      sameSite: isProd ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const safeUser = user.toObject();
    delete safeUser.password;
    res.json({ success: true, token: accessToken, user: safeUser });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

authRouter.post("/logout", (req, res) => {
  const isProd = process.env.NODE_ENV === "production";
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "strict" : "lax",
  });
  return res.json({ success: true, message: "Logged out successfully" });
});

// Issue new access token using refresh token cookie
authRouter.post("/refresh", (req, res) => {
  // Check if JWT secrets are configured
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ 
      success: false, 
      message: "Server configuration error: JWT_SECRET not set" 
    });
  }

  if (!process.env.REFRESH_SECRET) {
    return res.status(500).json({ 
      success: false, 
      message: "Server configuration error: REFRESH_SECRET not set" 
    });
  }

  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ success: false, message: "No refresh token" });
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const newAccessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
    return res.json({ success: true, token: newAccessToken });
  } catch (err) {
    return res.status(403).json({ success: false, message: "Invalid refresh token" });
  }
});

export default authRouter;
