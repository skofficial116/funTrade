import User from "../models/User.js";
import Referral from "../models/Referral.js";
import ReferralBonus from "../models/ReferralBonus.js";
import crypto from "crypto";

// Level requirements and bonus percentages
const LEVEL_REQUIREMENTS = {
  1: { directTeam: 5, volume: 1000, bonus: 10 },
  2: { directTeam: 10, volume: 5000, bonus: 8 },
  3: { directTeam: 15, volume: 10000, bonus: 5 },
  4: { directTeam: 20, volume: 15000, bonus: 3 },
  5: { directTeam: 25, volume: 25000, bonus: 1 },
};

const DIRECT_BUSINESS_BONUSES = [
  { min: 10000, max: 24999, bonus: 5 },
  { min: 25000, max: 49999, bonus: 7 },
  { min: 50000, max: Infinity, bonus: 10 },
];

const LEG_DISTRIBUTION = {
  power1: 40,
  power2: 30,
  other: 30,
};

class ReferralService {
  // Generate unique referral code
  static generateReferralCode(username) {
    const randomSuffix = crypto.randomBytes(3).toString("hex").toUpperCase();
    return `${username.substring(0, 4).toUpperCase()}${randomSuffix}`;
  }

  // Create referral code for user
  static async createReferralCode(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) throw new Error("User not found");

      if (user.referralCode) return user.referralCode;

      let referralCode;
      let isUnique = false;
      let attempts = 0;

      while (!isUnique && attempts < 10) {
        referralCode = this.generateReferralCode(user.username);
        const existingUser = await User.findOne({ referralCode });
        if (!existingUser) isUnique = true;
        attempts++;
      }

      if (!isUnique) {
        throw new Error("Unable to generate unique referral code");
      }

      user.referralCode = referralCode;
      await user.save();

      return referralCode;
    } catch (error) {
      throw new Error(`Failed to create referral code: ${error.message}`);
    }
  }

  // Process referral signup
  static async processReferralSignup(newUserId, referralCode) {
    try {
      if (!referralCode) return null;

      const referrer = await User.findOne({ referralCode });
      if (!referrer) throw new Error("Invalid referral code");

      const newUser = await User.findById(newUserId);
      if (!newUser) throw new Error("New user not found");

      // Update new user's referredBy field
      newUser.referredBy = referrer._id;
      await newUser.save();

      // Update referrer's direct team count
      referrer.directTeamCount += 1;
      await referrer.save();

      // Create referral relationship
      const referral = new Referral({
        referrer: referrer._id,
        referee: newUser._id,
        level: 1,
      });
      await referral.save();

      // Create referral relationships for upper levels (up to 5 levels)
      await this.createUplineReferrals(newUser._id, referrer._id);

      return { referrer, newUser };
    } catch (error) {
      throw new Error(`Failed to process referral signup: ${error.message}`);
    }
  }

  // Create referral relationships for upper levels
  static async createUplineReferrals(newUserId, directReferrerId) {
    try {
      let currentReferrer = await User.findById(directReferrerId).populate("referredBy");
      let level = 2;

      while (currentReferrer?.referredBy && level <= 5) {
        const referral = new Referral({
          referrer: currentReferrer.referredBy._id,
          referee: newUserId,
          level: level,
        });
        await referral.save();

        currentReferrer = await User.findById(currentReferrer.referredBy._id).populate("referredBy");
        level++;
      }
    } catch (error) {
      console.error("Error creating upline referrals:", error);
    }
  }

  // Process investment and calculate bonuses
  static async processInvestment(userId, amount) {
    try {
      const user = await User.findById(userId);
      if (!user) throw new Error("User not found");

      // Update user's investment
      user.totalInvestment += amount;
      user.rewardsCap = user.totalInvestment * 2.5; // 2.5x cap
      await user.save();

      // Process one-time referral bonus (5%)
      if (user.referredBy) {
        await this.processOneTimeReferralBonus(user.referredBy, userId, amount);
      }

      // Update volume for all upline referrals
      await this.updateUplineVolumes(userId, amount);

      // Recalculate levels for affected users
      await this.recalculateUserLevels(userId);

      return true;
    } catch (error) {
      throw new Error(`Failed to process investment: ${error.message}`);
    }
  }

  // Process one-time referral bonus
  static async processOneTimeReferralBonus(referrerId, sourceUserId, amount) {
    try {
      const referrer = await User.findById(referrerId);
      if (!referrer) return;

      const bonusAmount = amount * 0.05; // 5%

      // Check if bonus would exceed cap
      if (referrer.totalEarnings + bonusAmount > referrer.rewardsCap) {
        const cappedAmount = Math.max(0, referrer.rewardsCap - referrer.totalEarnings);
        if (cappedAmount <= 0) return;
      }

      const bonus = new ReferralBonus({
        userId: referrerId,
        bonusType: "one_time_referral",
        percentage: 5,
        baseAmount: amount,
        bonusAmount: bonusAmount,
        sourceUserId: sourceUserId,
        status: "pending",
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        legType: "direct",
      });

      await bonus.save();

      // Add to user's wallet and earnings
      referrer.walletBalance += bonusAmount;
      referrer.totalEarnings += bonusAmount;
      referrer.transactions.push({
        type: "credit",
        amount: bonusAmount,
        description: "One-time referral bonus",
        refId: bonus._id.toString(),
      });

      await referrer.save();

      // Update bonus status
      bonus.status = "paid";
      await bonus.save();
    } catch (error) {
      console.error("Error processing one-time referral bonus:", error);
    }
  }

  // Update volumes for all upline referrals
  static async updateUplineVolumes(userId, amount) {
    try {
      const referrals = await Referral.find({ referee: userId });

      for (const referral of referrals) {
        referral.totalVolume += amount;
        await referral.save();

        // Update user's leg volumes
        const referrer = await User.findById(referral.referrer);
        if (referrer) {
          // Determine leg type and update accordingly
          if (referral.legType === "power1") {
            referrer.powerLeg1Volume += amount;
          } else if (referral.legType === "power2") {
            referrer.powerLeg2Volume += amount;
          } else {
            referrer.otherLegsVolume += amount;
          }
          await referrer.save();
        }
      }
    } catch (error) {
      console.error("Error updating upline volumes:", error);
    }
  }

  // Recalculate user levels based on requirements
  static async recalculateUserLevels(userId) {
    try {
      // Get all users in the upline
      const referrals = await Referral.find({ referee: userId });
      const uplineUserIds = referrals.map(r => r.referrer);

      for (const uplineUserId of uplineUserIds) {
        const user = await User.findById(uplineUserId);
        if (!user) continue;

        const totalVolume = user.powerLeg1Volume + user.powerLeg2Volume + user.otherLegsVolume;
        let newLevel = 0;

        // Check level requirements
        for (let level = 5; level >= 1; level--) {
          const req = LEVEL_REQUIREMENTS[level];
          if (user.directTeamCount >= req.directTeam && totalVolume >= req.volume) {
            newLevel = level;
            break;
          }
        }

        if (newLevel !== user.currentLevel) {
          user.currentLevel = newLevel;
          await user.save();
        }
      }
    } catch (error) {
      console.error("Error recalculating user levels:", error);
    }
  }

  // Process monthly bonuses (to be run monthly)
  static async processMonthlyBonuses() {
    try {
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();

      // Get all users with levels > 0
      const eligibleUsers = await User.find({ currentLevel: { $gt: 0 } });

      for (const user of eligibleUsers) {
        await this.calculateMonthlyLevelBonus(user, currentMonth, currentYear);
        await this.calculateDirectBusinessBonus(user, currentMonth, currentYear);
      }
    } catch (error) {
      console.error("Error processing monthly bonuses:", error);
    }
  }

  // Calculate monthly level bonus
  static async calculateMonthlyLevelBonus(user, month, year) {
    try {
      if (user.currentLevel === 0) return;

      const levelConfig = LEVEL_REQUIREMENTS[user.currentLevel];
      const bonusPercentage = levelConfig.bonus;

      // Get all downline referrals for this user
      const referrals = await Referral.find({ referrer: user._id });

      for (const referral of referrals) {
        const referee = await User.findById(referral.referee);
        if (!referee) continue;

        // Calculate bonus based on leg distribution
        let legPercentage;
        if (referral.legType === "power1") {
          legPercentage = LEG_DISTRIBUTION.power1;
        } else if (referral.legType === "power2") {
          legPercentage = LEG_DISTRIBUTION.power2;
        } else {
          legPercentage = LEG_DISTRIBUTION.other;
        }

        const baseAmount = referee.monthlyDirectBusiness;
        const bonusAmount = (baseAmount * bonusPercentage * legPercentage) / (100 * 100);

        if (bonusAmount > 0 && user.totalEarnings + bonusAmount <= user.rewardsCap) {
          const bonus = new ReferralBonus({
            userId: user._id,
            bonusType: "monthly_level",
            level: user.currentLevel,
            percentage: bonusPercentage,
            baseAmount: baseAmount,
            bonusAmount: bonusAmount,
            sourceUserId: referee._id,
            status: "pending",
            month: month,
            year: year,
            legType: referral.legType,
          });

          await bonus.save();

          // Add to user's wallet
          user.walletBalance += bonusAmount;
          user.totalEarnings += bonusAmount;
          user.transactions.push({
            type: "credit",
            amount: bonusAmount,
            description: `Level ${user.currentLevel} monthly bonus`,
            refId: bonus._id.toString(),
          });

          await user.save();

          bonus.status = "paid";
          await bonus.save();
        }
      }
    } catch (error) {
      console.error("Error calculating monthly level bonus:", error);
    }
  }

  // Calculate direct business bonus
  static async calculateDirectBusinessBonus(user, month, year) {
    try {
      const monthlyBusiness = user.monthlyDirectBusiness;
      if (monthlyBusiness < 10000) return;

      let bonusPercentage = 0;
      for (const tier of DIRECT_BUSINESS_BONUSES) {
        if (monthlyBusiness >= tier.min && monthlyBusiness <= tier.max) {
          bonusPercentage = tier.bonus;
          break;
        }
      }

      if (bonusPercentage === 0) return;

      const bonusAmount = (monthlyBusiness * bonusPercentage) / 100;

      if (user.totalEarnings + bonusAmount <= user.rewardsCap) {
        const bonus = new ReferralBonus({
          userId: user._id,
          bonusType: "direct_business",
          percentage: bonusPercentage,
          baseAmount: monthlyBusiness,
          bonusAmount: bonusAmount,
          sourceUserId: user._id,
          status: "pending",
          month: month,
          year: year,
          legType: "direct",
        });

        await bonus.save();

        user.walletBalance += bonusAmount;
        user.totalEarnings += bonusAmount;
        user.transactions.push({
          type: "credit",
          amount: bonusAmount,
          description: "Direct business monthly bonus",
          refId: bonus._id.toString(),
        });

        await user.save();

        bonus.status = "paid";
        await bonus.save();
      }
    } catch (error) {
      console.error("Error calculating direct business bonus:", error);
    }
  }

  // Get referral statistics for a user
  static async getReferralStats(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) throw new Error("User not found");

      const directReferrals = await Referral.find({ referrer: userId, level: 1 }).populate("referee", "name email totalInvestment");
      const allReferrals = await Referral.find({ referrer: userId }).populate("referee", "name email totalInvestment");
      const bonuses = await ReferralBonus.find({ userId }).sort({ createdAt: -1 });

      const stats = {
        user: {
          referralCode: user.referralCode,
          currentLevel: user.currentLevel,
          directTeamCount: user.directTeamCount,
          totalEarnings: user.totalEarnings,
          rewardsCap: user.rewardsCap,
          remainingCap: user.rewardsCap - user.totalEarnings,
        },
        directReferrals,
        allReferrals,
        bonuses,
        levelProgress: this.calculateLevelProgress(user),
      };

      return stats;
    } catch (error) {
      throw new Error(`Failed to get referral stats: ${error.message}`);
    }
  }

  // Calculate progress towards next level
  static calculateLevelProgress(user) {
    const nextLevel = user.currentLevel + 1;
    if (nextLevel > 5) return null;

    const nextLevelReq = LEVEL_REQUIREMENTS[nextLevel];
    const totalVolume = user.powerLeg1Volume + user.powerLeg2Volume + user.otherLegsVolume;

    return {
      nextLevel,
      directTeamProgress: {
        current: user.directTeamCount,
        required: nextLevelReq.directTeam,
        percentage: Math.min(100, (user.directTeamCount / nextLevelReq.directTeam) * 100),
      },
      volumeProgress: {
        current: totalVolume,
        required: nextLevelReq.volume,
        percentage: Math.min(100, (totalVolume / nextLevelReq.volume) * 100),
      },
    };
  }
}

export default ReferralService;
