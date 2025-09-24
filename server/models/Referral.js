import mongoose from "mongoose";

const referralSchema = new mongoose.Schema(
  {
    referrer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    referee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    level: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    totalVolume: {
      type: Number,
      default: 0,
    },
    // Track which leg this referral belongs to (for power leg calculations)
    legType: {
      type: String,
      enum: ["power1", "power2", "other"],
      default: "other",
    },
  },
  { timestamps: true }
);

// Compound index for efficient queries
referralSchema.index({ referrer: 1, level: 1 });
referralSchema.index({ referee: 1 });

const Referral = mongoose.model("Referral", referralSchema);

export default Referral;
