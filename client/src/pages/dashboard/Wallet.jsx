import { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import { useTheme } from "../../context/ThemeContext";
import WalletBalance from "../../components/educator/WalletBalance";
import RecentTransactions from "../../components/educator/RecentTransactions";
import InvestmentTracker from "../../components/educator/InvestmentTracker";

const WalletPage = () => {
  const { backendUrl, getToken, fetchUserData } = useContext(AppContext);
  const { theme } = useTheme();
  const [tx, setTx] = useState({ type: "credit", amount: "", description: "" });

  const submitTx = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      if (!token) {
        toast.error("Not authenticated");
        return;
      }
      const payload = {
        type: tx.type,
        amount: Number(tx.amount),
        description: tx.description || null,
      };
      const { data } = await axios.post(
        `${backendUrl}/api/user/transactions`,
        payload,
        { 
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true 
        }
      );
      if (data.success) {
        toast.success("Transaction added");
        setTx({ type: "credit", amount: "", description: "" });
        await fetchUserData();
      } else {
        toast.error(data.message || "Failed to add transaction");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };
  return (
    <div className={`p-6 min-h-screen bg-gradient-to-br ${theme.colors.primary}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${theme.colors.textAccent}`}>Wallet</h2>
      </div>
      
      {/* Quick add transaction */}
      <form onSubmit={submitTx} className={`mb-6 ${theme.colors.secondary} ${theme.colors.border} border rounded-lg p-4 ${theme.colors.textPrimary}`}>
        <h3 className={`text-lg font-semibold ${theme.colors.textAccent} mb-3`}>Add Test Transaction</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <select
            value={tx.type}
            onChange={(e) => setTx((p) => ({ ...p, type: e.target.value }))}
            className={`${theme.colors.input} ${theme.colors.border} border rounded px-3 py-2`}
          >
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </select>
          <input
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Amount"
            value={tx.amount}
            onChange={(e) => setTx((p) => ({ ...p, amount: e.target.value }))}
            className={`${theme.colors.input} ${theme.colors.border} border rounded px-3 py-2`}
            required
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={tx.description}
            onChange={(e) => setTx((p) => ({ ...p, description: e.target.value }))}
            className={`${theme.colors.input} ${theme.colors.border} border rounded px-3 py-2 md:col-span-2`}
          />
          <button
            type="submit"
            className={`${theme.colors.button} font-semibold rounded px-4 py-2 transition-colors`}
          >
            Add
          </button>
        </div>
      </form>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* <WalletBalance /> */}
        <InvestmentTracker />
      </div>
      <RecentTransactions />
    </div>
  );
};

export default WalletPage;
