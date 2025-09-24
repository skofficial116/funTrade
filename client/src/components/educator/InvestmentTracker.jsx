import { useState, useContext } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import { useTheme } from "../../context/ThemeContext";
import ReferralService from "../../services/referralService";

const InvestmentTracker = () => {
  const { userData, fetchUserData } = useContext(AppContext);
  const { theme } = useTheme();
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInvestment = async (e) => {
    e.preventDefault();
    
    const investmentAmount = parseFloat(amount);
    if (!investmentAmount || investmentAmount <= 0) {
      toast.error("Please enter a valid investment amount");
      return;
    }

    setIsProcessing(true);
    try {
      // Process the investment through referral service
      await ReferralService.processInvestment(investmentAmount);
      
      // Refresh user data to get updated wallet balance
      await fetchUserData();
      
      toast.success("Investment processed successfully! Referral bonuses have been calculated.");
      setAmount("");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  return (
    <div className={`${theme.colors.secondary} rounded-lg shadow-md p-6 ${theme.colors.border} border`}>
      <h3 className={`text-lg font-semibold mb-4 ${theme.colors.textAccent}`}>Investment Tracker</h3>
      
      {/* Current Investment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className={`${theme.colors.tertiary} p-4 rounded-lg ${theme.colors.border} border`}>
          <p className={`text-sm font-medium ${theme.colors.textSecondary}`}>Total Investment</p>
          <p className={`text-xl font-bold ${theme.colors.textPrimary}`}>
            {formatCurrency(userData?.totalInvestment)}
          </p>
        </div>
        <div className={`${theme.colors.tertiary} p-4 rounded-lg ${theme.colors.border} border`}>
          <p className={`text-sm font-medium ${theme.colors.textSecondary}`}>Total Earnings</p>
          <p className={`text-xl font-bold text-green-500`}>
            {formatCurrency(userData?.totalEarnings)}
          </p>
        </div>
        <div className={`${theme.colors.tertiary} p-4 rounded-lg ${theme.colors.border} border`}>
          <p className={`text-sm font-medium ${theme.colors.textSecondary}`}>Rewards Cap</p>
          <p className={`text-xl font-bold text-orange-500`}>
            {formatCurrency(userData?.rewardsCap)}
          </p>
        </div>
      </div>

      {/* Investment Form */}
      <form onSubmit={handleInvestment} className="space-y-4">
        <div>
          <label htmlFor="investment" className={`block text-sm font-medium ${theme.colors.textSecondary} mb-1`}>
            Investment Amount
          </label>
          <div className="relative">
            <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.colors.textSecondary}`}>₹</span>
            <input
              type="number"
              id="investment"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="1"
              step="0.01"
              className={`w-full pl-8 pr-3 py-2 ${theme.colors.input} ${theme.colors.border} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isProcessing || !amount}
          className={`w-full ${theme.colors.button} py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Processing...</span>
            </div>
          ) : (
            "Process Investment"
          )}
        </button>
      </form>

      {/* Investment Benefits Info */}
      <div className={`mt-6 ${theme.colors.tertiary} p-4 rounded-lg ${theme.colors.border} border`}>
        <h4 className={`font-medium ${theme.colors.textPrimary} mb-2`}>Investment Benefits:</h4>
        <ul className={`text-sm ${theme.colors.textSecondary} space-y-1`}>
          <li>• Your rewards cap will be updated to 2.5x of total investment</li>
          <li>• Referral bonuses will be calculated for your upline</li>
          <li>• Monthly level bonuses based on your network performance</li>
          <li>• Direct business bonuses for qualifying volumes</li>
        </ul>
      </div>

      {/* Rewards Cap Progress */}
      {userData?.rewardsCap > 0 && (
        <div className="mt-6">
          <div className={`flex justify-between text-sm ${theme.colors.textSecondary} mb-2`}>
            <span>Rewards Progress</span>
            <span>
              {formatCurrency(userData?.totalEarnings)} / {formatCurrency(userData?.rewardsCap)}
            </span>
          </div>
          <div className={`w-full ${theme.isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${Math.min(100, ((userData?.totalEarnings || 0) / (userData?.rewardsCap || 1)) * 100)}%` 
              }}
            ></div>
          </div>
          <p className={`text-xs ${theme.colors.textSecondary} mt-1`}>
            {userData?.rewardsCap - userData?.totalEarnings > 0 
              ? `${formatCurrency(userData?.rewardsCap - userData?.totalEarnings)} remaining`
              : "Rewards cap reached"
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default InvestmentTracker;
