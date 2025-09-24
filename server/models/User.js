import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["credit", "debit"], required: true },
    amount: { type: Number, required: true },
    description: { type: String, default: null },
    refId: { type: String, default: null },
  },
  { timestamps: true, _id: false }
);

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "educator", "admin"], default: "student" },

    // Profile fields used by dashboard
    name: { type: String, default: null },
    phone: { type: String, default: null },
    location: { type: String, default: null },
    avatarUrl: { type: String, default: null },
    bio: { type: String, default: null },
    isPhoneVerified: { type: Boolean, default: false },

    // Wallet & activity
    walletBalance: { type: Number, default: 0 },
    transactions: { type: [transactionSchema], default: [] },

    // Referral system fields
    referralCode: { type: String, unique: true, sparse: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    totalInvestment: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    rewardsCap: { type: Number, default: 0 }, // 2.5x of investment
    directTeamCount: { type: Number, default: 0 },
    currentLevel: { type: Number, default: 0 },
    powerLeg1Volume: { type: Number, default: 0 },
    powerLeg2Volume: { type: Number, default: 0 },
    otherLegsVolume: { type: Number, default: 0 },
    monthlyDirectBusiness: { type: Number, default: 0 },
  },
  { timestamps: true, minimize: false }
);

// Avoid OverwriteModelError on hot reload
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
