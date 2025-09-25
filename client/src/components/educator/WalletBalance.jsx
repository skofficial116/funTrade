import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

const WalletBalance = () => {
  const { userData } = useContext(AppContext);
  const total = Number(userData?.walletBalance ?? 0);
  const available = total; // adjust if you have holds/pending on backend
  const pending = 0;

  const balanceCards = [
    {
      title: "Total Balance",
      amount: `$${total.toFixed(2)}`,
      gradient: "from-[#34d3f5] to-cyan-700",
    },
    {
      title: "Available",
      amount: `$${available.toFixed(2)}`,
      gradient: "from-green-400 to-green-700",
    },
    {
      title: "Pending",
      amount: `$${pending.toFixed(2)}`,
      gradient: "from-orange-400 to-orange-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      {balanceCards.map((card, index) => (
        <div
          key={index}
          className={`bg-gradient-to-r ${card.gradient} rounded-lg p-6 text-white shadow-lg hover:shadow-cyan-500/20 transition`}
        >
          <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
          <p className="text-3xl font-bold">{card.amount}</p>
        </div>
      ))}
    </div>
  );
};

export default WalletBalance;
