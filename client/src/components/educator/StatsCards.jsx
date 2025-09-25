import { useContext } from "react";
import { useTheme } from "../../context/ThemeContext";
import { AppContext } from "../../context/AppContext";

const StatCards = () => {
  const { theme } = useTheme();
  const { userData } = useContext(AppContext);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  const stats = [
    {
      title: "Total Investment",
      value: formatCurrency(userData?.totalInvestment),
      change: "Current investment amount",
      changeColor: "text-blue-400",
    },
    {
      title: "Total Earnings",
      value: formatCurrency(userData?.totalEarnings),
      change: "Lifetime earnings",
      changeColor: "text-green-400",
    },
    {
      title: "Referral Network",
      value: userData?.referralStats?.totalReferrals || "0",
      change: "Active referrals",
      changeColor: "text-cyan-400",
    },
    {
      title: "Rewards Cap",
      value: formatCurrency(userData?.rewardsCap),
      change: "Available earning limit",
      changeColor: "text-orange-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`${theme.colors.secondary} rounded-lg shadow-lg p-6 ${theme.colors.border} border`}
        >
          <h3 className={`text-sm font-medium ${theme.colors.textSecondary} mb-2`}>
            {stat.title}
          </h3>
          <p className={`text-2xl font-bold ${theme.colors.textPrimary}`}>{stat.value}</p>
          <p className={`text-sm ${stat.changeColor}`}>{stat.change}</p>
        </div>
      ))}
    </div>
  );
};
export default StatCards;
