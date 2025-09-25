import express from "express";
import {
  generateReferralCode,
  validateReferralCode,
  processReferralSignup,
  processInvestment,
  getReferralStats,
  getReferralTree,
  processMonthlyBonuses,
} from "../controllers/referralController.js";
import authMiddleware from "../middlewares/auth.js";

const referralRouter = express.Router();

// Generate referral code for authenticated user
referralRouter.post("/generate-code", authMiddleware, generateReferralCode);

// Validate referral code (public endpoint)
referralRouter.get("/validate/:referralCode", validateReferralCode);

// Process referral signup
referralRouter.post("/signup", processReferralSignup);

// Process investment and calculate bonuses
referralRouter.post("/investment", authMiddleware, processInvestment);

// Get referral statistics for authenticated user
referralRouter.get("/stats", authMiddleware, getReferralStats);

// Get referral tree/network
referralRouter.get("/tree", authMiddleware, getReferralTree);

// Process monthly bonuses (admin only)
referralRouter.post("/process-monthly", authMiddleware, processMonthlyBonuses);

export default referralRouter;
