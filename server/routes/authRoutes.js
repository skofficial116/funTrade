import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { 
  generateOTP, 
  sendVerificationEmail, 
  generatePasswordResetToken, 
  sendPasswordResetEmail 
} from "../utils/authUtils.js";
import { isAuthenticated } from "../middleware/auth.js";

const authRouter = express.Router();

// Register
authRouter.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationOTP = generateOTP();
    const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await User.create({
      username,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      emailVerificationOTP: verificationOTP,
      emailVerificationExpires: verificationExpires
    });

    // Send verification email in background
    try {
      await sendVerificationEmail(user.email, verificationOTP);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail the request if email sending fails
    }

    const safeUser = user.toObject();
    delete safeUser.password;
    delete safeUser.emailVerificationOTP;
    delete safeUser.emailVerificationExpires;
    
    res.status(201).json({ 
      success: true, 
      message: "User created. Please check your email to verify your account.",
      requiresVerification: true,
      userId: user._id
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Verify Email with OTP
authRouter.post("/verify-email", async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    const user = await User.findOne({ 
      email,
      emailVerificationOTP: otp,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid or expired OTP" 
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationOTP = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    const safeUser = user.toObject();
    delete safeUser.password;
    delete safeUser.emailVerificationOTP;
    delete safeUser.emailVerificationExpires;

    res.json({ 
      success: true, 
      message: "Email verified successfully",
      user: safeUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Resend Verification Email
authRouter.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ 
        success: false, 
        message: "Email already verified" 
      });
    }

    const verificationOTP = generateOTP();
    const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.emailVerificationOTP = verificationOTP;
    user.emailVerificationExpires = verificationExpires;
    await user.save();

    // Send verification email in background
    try {
      await sendVerificationEmail(user.email, verificationOTP);
      res.json({ success: true, message: "Verification email resent" });
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      res.status(500).json({ 
        success: false, 
        message: "Failed to send verification email" 
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid email or password" 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid email or password" 
      });
    }

    // Email verification is not required for login
    // But you can uncomment this if you want to require email verification
    /*
    if (!user.isEmailVerified) {
      return res.status(403).json({ 
        success: false, 
        requiresVerification: true,
        message: "Please verify your email before logging in" 
      });
    }
    */

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
      sameSite:"none",
      // sameSite: isProd ? "strict" : "lax",
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
    sameSite: "none",
    // sameSite: isProd ? "strict" : "lax",
  });
  return res.json({ success: true, message: "Logged out successfully" });
});

// Forgot Password - Send reset link
authRouter.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal that the email doesn't exist
      return res.json({ 
        success: true, 
        message: "If an account exists with this email, a password reset link has been sent." 
      });
    }

    // Generate and save reset token
    const token = generatePasswordResetToken();
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    // Send password reset email
    try {
      await sendPasswordResetEmail(user.email, token);
      res.json({ 
        success: true, 
        message: "Password reset link sent to your email" 
      });
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      res.status(500).json({ 
        success: false, 
        message: "Failed to send password reset email" 
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Reset Password
authRouter.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: "Token and new password are required" 
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid or expired token" 
      });
    }

    // Update password and clear reset token
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ 
      success: true, 
      message: "Password has been reset successfully" 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update Phone Number (resets verification if phone number changes)
authRouter.put("/update-phone", isAuthenticated, async (req, res) => {
  try {
    const { phone } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // If phone number is being changed, reset verification
    if (phone && phone !== user.phone) {
      user.phone = phone;
      user.isPhoneVerified = false;
      // Here you would typically send a new OTP to the new phone number
    }

    await user.save();

    const safeUser = user.toObject();
    delete safeUser.password;
    delete safeUser.emailVerificationOTP;
    delete safeUser.emailVerificationExpires;
    delete safeUser.resetPasswordToken;
    delete safeUser.resetPasswordExpires;

    res.json({ 
      success: true, 
      message: "Phone number updated successfully",
      user: safeUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
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
