import React, { useState } from "react";
import Sidebar from "../../components/educator/Sidebar";
import Header from "../../components/educator/Header";
import MyAccountPage from "./MyAccount";
import WalletPage from "./Wallet";
import SettingsPage from "./Settings";
import AnalyticsPage from "./Analytics";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("My Account");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (activeTab) {
      case "My Account":
        return <MyAccountPage />;
      case "Wallet":
        return <WalletPage />;
      case "Settings":
        return <SettingsPage />;
      case "Analytics":
        return <AnalyticsPage />;
      default:
        return <div className="p-6">Page not found</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto">{renderPage()}</main>
      </div>
    </div>
  );
};

export default Dashboard;
