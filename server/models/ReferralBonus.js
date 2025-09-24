import mongoose from "mongoose";

const referralBonusSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bonusType: {
      type: String,
      enum: ["one_time_referral", "monthly_level", "direct_business"],
      required: true,
    },
    level: {
      type: Number,
      min: 1,
      max: 5,
      default: null, // Only for monthly_level bonuses
    },
    percentage: {
      type: Number,
      required: true,
    },
    baseAmount: {
      type: Number,
      required: true,
    },
    bonusAmount: {
      type: Number,
      required: true,
    },
    sourceUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // The user whose activity generated this bonus
    },
    sourceTransactionId: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "capped", "cancelled"],
      default: "pending",
    },
    month: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    legType: {
      type: String,
      enum: ["power1", "power2", "other", "direct"],
      default: "direct",
    },
    notes: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// Indexes for efficient queries
referralBonusSchema.index({ userId: 1, month: 1, year: 1 });
referralBonusSchema.index({ sourceUserId: 1 });
referralBonusSchema.index({ status: 1 });

const ReferralBonus = mongoose.model("ReferralBonus", referralBonusSchema);

export default ReferralBonus;
