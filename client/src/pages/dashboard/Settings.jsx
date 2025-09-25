import NotificationSettings from "../../components/educator/NotificationSettings";
import ReferralSettings from "../../components/educator/ReferralSettings";
import ThemeToggle from "../../components/common/ThemeToggle";
import { useTheme } from "../../context/ThemeContext";

const SettingsPage = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen p-6 bg-gradient-to-br ${theme.colors.primary} ${theme.colors.textPrimary}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${theme.colors.textAccent}`}>Settings</h2>
        <div className="flex items-center space-x-4">
          <span className={`text-sm ${theme.colors.textSecondary}`}>Theme:</span>
          <ThemeToggle />
        </div>
      </div>
      <div className="space-y-6">
        <NotificationSettings />
        <ReferralSettings />
      </div>
    </div>
  );
};

export default SettingsPage;
