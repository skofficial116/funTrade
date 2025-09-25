import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { useTheme } from "../../context/ThemeContext";

const RecentTransactions = () => {
  const { userData } = useContext(AppContext);
  const { theme } = useTheme();
  const transactions = Array.isArray(userData?.transactions)
    ? userData.transactions
    : [];

  return (
    <div className={`${theme.colors.secondary} rounded-lg shadow-lg p-6 ${theme.colors.border} border`}>
      <h3 className={`text-lg font-semibold ${theme.colors.textAccent} mb-4`}>
        Recent Transactions
      </h3>
      <div className="space-y-4">
        {transactions.length === 0 && (
          <p className={`${theme.colors.textSecondary}`}>No transactions yet.</p>
        )}
        {transactions.map((t, index) => (
          <div
            key={index}
            className={`flex justify-between items-center p-4 ${theme.colors.tertiary} rounded-lg hover:opacity-80 transition ${theme.colors.border} border`}
          >
            <div>
              <p className={`font-medium ${theme.colors.textPrimary}`}>{t.description || "Transaction"}</p>
              <p className={`text-sm ${theme.colors.textSecondary}`}>
                {new Date(t.createdAt || Date.now()).toLocaleString()}
              </p>
            </div>
            <p
              className={`font-bold ${
                (t.type || "credit").toLowerCase() === "credit"
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {`${(t.type || "credit").toLowerCase() === "credit" ? "+" : "-"}$${Number(t.amount || 0).toFixed(2)}`}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default RecentTransactions;
