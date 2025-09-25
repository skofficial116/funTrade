import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

class ReferralService {
  static getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true
    };
  }

  // Generate referral code
  static async generateReferralCode() {
    try {
      const response = await axios.post(
        `${backendUrl}/api/referral/generate-code`,
        {},
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to generate referral code");
    }
  }

  // Validate referral code
  static async validateReferralCode(referralCode) {
    try {
      const response = await axios.get(
        `${backendUrl}/api/referral/validate/${referralCode}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Invalid referral code");
    }
  }

  // Process referral signup
  static async processReferralSignup(userId, referralCode) {
    try {
      const response = await axios.post(
        `${backendUrl}/api/referral/signup`,
        { userId, referralCode },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to process referral signup");
    }
  }

  // Process investment
  static async processInvestment(amount) {
    try {
      const response = await axios.post(
        `${backendUrl}/api/referral/investment`,
        { amount },
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to process investment");
    }
  }

  // Get referral statistics
  static async getReferralStats() {
    try {
      const response = await axios.get(
        `${backendUrl}/api/referral/stats`,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to get referral stats");
    }
  }

  // Get referral tree
  static async getReferralTree() {
    try {
      const response = await axios.get(
        `${backendUrl}/api/referral/tree`,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to get referral tree");
    }
  }
}

export default ReferralService;
