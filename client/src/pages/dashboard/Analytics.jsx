import { useState, useContext } from "react";
import { useTheme } from "../../context/ThemeContext";
import { AppContext } from "../../context/AppContext";
import StatsCards from "../../components/educator/StatsCards.jsx";
import PerformanceChart from "../../components/educator/PerformanceChart";
import TopPerformers from "../../components/educator/TopPerformers";
import TransactionChart from "../../components/educator/TransactionChart";

const AnalyticsPage = () => {
  const { theme } = useTheme();
  const { userData } = useContext(AppContext);
  const [timeframe, setTimeframe] = useState("monthly");

  return (
    <div className={`p-6 min-h-screen bg-gradient-to-br ${theme.colors.primary}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${theme.colors.textAccent}`}>Analytics Dashboard</h2>
        
        {/* Timeframe Selector */}
        <div className="flex items-center space-x-2">
          <span className={`text-sm ${theme.colors.textSecondary}`}>View:</span>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className={`${theme.colors.input} ${theme.colors.border} border rounded px-3 py-1 text-sm`}
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
          </select>
        </div>
      </div>
      
      <div className="space-y-6">
        <StatsCards />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PerformanceChart timeframe={timeframe} />
          <TransactionChart timeframe={timeframe} />
        </div>
        <TopPerformers />
      </div>
    </div>
  );
};

export default AnalyticsPage;
