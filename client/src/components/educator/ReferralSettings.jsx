import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ReferralService from "../../services/referralService";
import { useTheme } from "../../context/ThemeContext";

const ReferralSettings = () => {
  const { theme } = useTheme();
  const [referralCode, setReferralCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    fetchReferralCode();
  }, []);

  const fetchReferralCode = async () => {
    try {
      const response = await ReferralService.getReferralStats();
      if (response.success && response.data.user.referralCode) {
        setReferralCode(response.data.user.referralCode);
      }
    } catch (error) {
      console.error("Error fetching referral code:", error);
    }
  };

  const generateReferralCode = async () => {
    setIsGenerating(true);
    try {
      const response = await ReferralService.generateReferralCode();
      if (response.success) {
        setReferralCode(response.referralCode);
        toast.success("Referral code generated successfully!");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyReferralLink = () => {
    if (referralCode) {
      const referralLink = `${window.location.origin}/signup?ref=${referralCode}`;
      navigator.clipboard.writeText(referralLink);
      setCopySuccess(true);
      toast.success("Referral link copied to clipboard!");
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const copyReferralCode = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      toast.success("Referral code copied to clipboard!");
    }
  };

  return (
    <div className={`${theme.colors.secondary} rounded-lg shadow-sm ${theme.colors.border} border p-6`}>
      <h3 className={`text-lg font-semibold ${theme.colors.textAccent} mb-4`}>Referral Settings</h3>
      
      <div className="space-y-6">
        {/* Referral Code Section */}
        <div>
          <label className={`block text-sm font-medium ${theme.colors.textSecondary} mb-2`}>
            Your Referral Code
          </label>
          {referralCode ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className={`${theme.colors.tertiary} px-4 py-2 rounded-lg font-mono text-lg flex-1 ${theme.colors.textPrimary}`}>
                  {referralCode}
                </div>
                <button
                  onClick={copyReferralCode}
                  className={`px-3 py-2 ${theme.colors.buttonSecondary} rounded-lg transition-colors text-sm`}
                >
                  Copy Code
                </button>
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={`${window.location.origin}/signup?ref=${referralCode}`}
                  readOnly
                  className={`flex-1 px-3 py-2 ${theme.colors.input} ${theme.colors.border} border rounded-lg text-sm`}
                />
                <button
                  onClick={copyReferralLink}
                  className={`px-3 py-2 rounded-lg transition-colors text-sm ${
                    copySuccess
                      ? theme.colors.success
                      : theme.colors.button
                  }`}
                >
                  {copySuccess ? "Copied!" : "Copy Link"}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className={`${theme.colors.textSecondary} mb-4`}>You don't have a referral code yet.</p>
              <button
                onClick={generateReferralCode}
                disabled={isGenerating}
                className={`${theme.colors.button} px-6 py-2 rounded-lg disabled:opacity-50 transition-colors`}
              >
                {isGenerating ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Generating...</span>
                  </div>
                ) : (
                  "Generate Referral Code"
                )}
              </button>
            </div>
          )}
        </div>

        {/* Referral Program Info */}
        <div className={`${theme.colors.tertiary} ${theme.colors.border} border rounded-lg p-4`}>
          <h4 className={`font-medium ${theme.colors.textAccent} mb-2`}>Referral Program Benefits</h4>
          <ul className={`text-sm ${theme.colors.textSecondary} space-y-1`}>
            <li>• <strong>One-time Bonus:</strong> Earn 5% on each direct referral's first investment</li>
            <li>• <strong>Monthly Level Bonuses:</strong> Earn 1-10% based on your level and team performance</li>
            <li>• <strong>Direct Business Bonuses:</strong> Earn 5-10% on your monthly direct business volume</li>
            <li>• <strong>Multi-Level Structure:</strong> Earn from up to 5 levels deep in your network</li>
          </ul>
        </div>

        {/* Level Requirements */}
        <div className={`${theme.colors.tertiary} ${theme.colors.border} border rounded-lg p-4`}>
          <h4 className={`font-medium ${theme.colors.textPrimary} mb-3`}>Level Requirements & Bonuses</h4>
          <div className="space-y-2 text-sm">
            <div className={`grid grid-cols-4 gap-2 font-medium ${theme.colors.textSecondary} ${theme.colors.border} border-b pb-2`}>
              <span>Level</span>
              <span>Direct Team</span>
              <span>Volume</span>
              <span>Bonus %</span>
            </div>
            {[
              { level: 1, team: 5, volume: "₹1,000", bonus: "10%" },
              { level: 2, team: 10, volume: "₹5,000", bonus: "8%" },
              { level: 3, team: 15, volume: "₹10,000", bonus: "5%" },
              { level: 4, team: 20, volume: "₹15,000", bonus: "3%" },
              { level: 5, team: 25, volume: "₹25,000", bonus: "1%" },
            ].map((item) => (
              <div key={item.level} className={`grid grid-cols-4 gap-2 py-1 ${theme.colors.textSecondary}`}>
                <span className={`font-medium ${theme.colors.textPrimary}`}>Level {item.level}</span>
                <span>{item.team} members</span>
                <span>{item.volume}</span>
                <span className="text-green-500 font-medium">{item.bonus}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Direct Business Bonuses */}
        <div className={`${theme.colors.tertiary} ${theme.colors.border} border rounded-lg p-4`}>
          <h4 className={`font-medium ${theme.colors.textPrimary} mb-3`}>Direct Business Monthly Bonuses</h4>
          <div className="space-y-2 text-sm">
            <div className={`grid grid-cols-2 gap-2 font-medium ${theme.colors.textSecondary} ${theme.colors.border} border-b pb-2`}>
              <span>Monthly Volume</span>
              <span>Bonus %</span>
            </div>
            {[
              { range: "₹10,000 - ₹24,999", bonus: "5%" },
              { range: "₹25,000 - ₹49,999", bonus: "7%" },
              { range: "₹50,000 and above", bonus: "10%" },
            ].map((item, index) => (
              <div key={index} className={`grid grid-cols-2 gap-2 py-1 ${theme.colors.textSecondary}`}>
                <span>{item.range}</span>
                <span className="text-green-500 font-medium">{item.bonus}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Important Notes */}
        <div className={`${theme.colors.tertiary} ${theme.colors.border} border rounded-lg p-4`}>
          <h4 className={`font-medium ${theme.colors.textPrimary} mb-2`}>Important Notes</h4>
          <ul className={`text-sm ${theme.colors.textSecondary} space-y-1`}>
            <li>• Rewards are capped at 2.5x of your total investment</li>
            <li>• Caps can be topped up with additional investments</li>
            <li>• Monthly bonuses are calculated and distributed automatically</li>
            <li>• All bonuses are subject to network performance and activity</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReferralSettings;
