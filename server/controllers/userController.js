import User from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";

export const getUserData = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.json({
        success: false,
        message: "User Not Found",
      });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const addTransaction = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { type, amount, description, refId } = req.body || {};
    const tType = String(type || "").toLowerCase();
    const amt = Number(amount);
    if (!["credit", "debit"].includes(tType) || !Number.isFinite(amt) || amt <= 0) {
      return res.status(400).json({ success: false, message: "Invalid transaction payload" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User Not Found" });
    }

    // Update balance
    if (tType === "credit") user.walletBalance = (user.walletBalance || 0) + amt;
    else user.walletBalance = (user.walletBalance || 0) - amt;

    // Push transaction
    user.transactions.push({ type: tType, amount: amt, description: description || null, refId: refId || null });
    await user.save();

    const safeUser = await User.findById(userId).select("-password");
    return res.json({ success: true, user: safeUser });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { name, phone, location, bio } = req.body;

    // Validate input
    const updates = {};
    if (name !== undefined) updates.name = name.trim();
    if (phone !== undefined) updates.phone = phone.trim();
    if (location !== undefined) updates.location = location.trim();
    if (bio !== undefined) updates.bio = bio.trim();

    // Phone number validation (basic)
    if (updates.phone && !/^\+?[\d\s\-\(\)]{10,15}$/.test(updates.phone)) {
      return res.status(400).json({ success: false, message: "Invalid phone number format" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user, message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Current password and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "New password must be at least 6 characters long" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Verify current password
    const bcrypt = await import("bcryptjs");
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const requestPhoneVerification = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, message: "Phone number is required" });
    }

    // Phone number validation
    if (!/^\+?[\d\s\-\(\)]{10,15}$/.test(phone)) {
      return res.status(400).json({ success: false, message: "Invalid phone number format" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update phone number
    user.phone = phone.trim();
    await user.save();

    // TODO: Implement actual SMS verification logic here
    // For now, we'll just simulate the process
    res.json({ 
      success: true, 
      message: "Verification code sent to your phone number",
      // In real implementation, don't send the code in response
      verificationCode: "123456" // This is just for testing
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyPhone = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { verificationCode } = req.body;

    if (!verificationCode) {
      return res.status(400).json({ success: false, message: "Verification code is required" });
    }

    // TODO: Implement actual verification logic here
    // For now, we'll accept "123456" as valid code
    if (verificationCode !== "123456") {
      return res.status(400).json({ success: false, message: "Invalid verification code" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { isPhoneVerified: true },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ 
      success: true, 
      user,
      message: "Phone number verified successfully" 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // File validation is now handled by multer middleware

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    try {
      // Delete old avatar from cloudinary if exists
      if (user.avatarUrl) {
        const publicId = user.avatarUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`avatars/${publicId}`);
      }

      // Convert buffer to base64 and upload to cloudinary
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const uploadResult = await cloudinary.uploader.upload(dataURI, {
        folder: "avatars",
        width: 300,
        height: 300,
        crop: "fill",
        gravity: "face",
        quality: "auto",
        fetch_format: "auto",
        timeout: 60000 // 60 seconds timeout
      });

      // Update user with new avatar URL
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { avatarUrl: uploadResult.secure_url },
        { new: true }
      ).select("-password");

      res.json({
        success: true,
        message: "Avatar uploaded successfully",
        user: updatedUser,
        avatarUrl: uploadResult.secure_url
      });

    } catch (cloudinaryError) {
      console.error("Cloudinary upload error:", cloudinaryError);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to upload image to cloud storage" 
      });
    }

  } catch (error) {
    console.error("Avatar upload error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
