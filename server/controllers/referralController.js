import ReferralService from "../services/referralService.js";
import User from "../models/User.js";

// Generate referral code for user
export const generateReferralCode = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const referralCode = await ReferralService.createReferralCode(userId);
    res.json({ success: true, referralCode });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Validate referral code
export const validateReferralCode = async (req, res) => {
  try {
    const { referralCode } = req.params;
    
    const referrer = await User.findOne({ referralCode }).select("name username referralCode");
    if (!referrer) {
      return res.status(404).json({ success: false, message: "Invalid referral code" });
    }

    res.json({ success: true, referrer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Process referral signup
export const processReferralSignup = async (req, res) => {
  try {
    const { userId, referralCode } = req.body;
    
    if (!userId || !referralCode) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const result = await ReferralService.processReferralSignup(userId, referralCode);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Process investment and calculate bonuses
export const processInvestment = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { amount } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    await ReferralService.processInvestment(userId, amount);
    res.json({ success: true, message: "Investment processed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get referral statistics
export const getReferralStats = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const stats = await ReferralService.getReferralStats(userId);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get referral tree/network
export const getReferralTree = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // This would be a complex query to build the tree structure
    // For now, returning basic referral data
    const stats = await ReferralService.getReferralStats(userId);
    res.json({ success: true, data: stats.allReferrals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Process monthly bonuses (admin only)
export const processMonthlyBonuses = async (req, res) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId);
    
    if (!user || user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }

    await ReferralService.processMonthlyBonuses();
    res.json({ success: true, message: "Monthly bonuses processed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
