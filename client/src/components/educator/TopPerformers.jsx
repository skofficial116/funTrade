import { useContext } from "react";
import { useTheme } from "../../context/ThemeContext";
import { AppContext } from "../../context/AppContext";

const TopPerformers = () => {
  const { theme } = useTheme();
  const { userData } = useContext(AppContext);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  // Generate performance data based on user's actual data
  const performers = [
    { 
      name: "Direct Referrals", 
      value: userData?.referralStats?.directReferrals || "0", 
      growth: "+12%",
      type: "count"
    },
    { 
      name: "Monthly Earnings", 
      value: formatCurrency((userData?.totalEarnings || 0) / 12), 
      growth: "+8%",
      type: "currency"
    },
    { 
      name: "Network Size", 
      value: userData?.referralStats?.totalReferrals || "0", 
      growth: "+15%",
      type: "count"
    },
    { 
      name: "Investment ROI", 
      value: userData?.totalInvestment > 0 
        ? `${(((userData?.totalEarnings || 0) / userData.totalInvestment) * 100).toFixed(1)}%`
        : "0%", 
      growth: "+5%",
      type: "percentage"
    },
  ];

  return (
    <div className={`${theme.colors.secondary} rounded-lg shadow-lg p-6 mt-6 ${theme.colors.border} border`}>
      <h3 className={`text-lg font-semibold ${theme.colors.textAccent} mb-4`}>
        Performance Metrics
      </h3>
      <div className="space-y-4">
        {performers.map((performer, index) => (
          <div
            key={index}
            className={`flex justify-between items-center p-4 ${theme.colors.tertiary} rounded-lg ${theme.colors.border} border`}
          >
            <div>
              <p className={`font-medium ${theme.colors.textPrimary}`}>{performer.name}</p>
              <p className={`text-sm ${theme.colors.textSecondary}`}>
                {performer.type === "currency" ? "Monthly Average" : 
                 performer.type === "count" ? "Total Count" : "Performance"}
              </p>
            </div>
            <div className="text-right">
              <p className={`font-bold ${theme.colors.textPrimary}`}>{performer.value}</p>
              <p
                className={`text-sm ${
                  performer.growth.startsWith("+")
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {performer.growth}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopPerformers;
