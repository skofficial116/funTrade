import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

const NotificationSettings = () => {
  const { theme, currentTheme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState([
    { name: "Email Notifications", checked: true, key: "email" },
    { name: "SMS Notifications", checked: false, key: "sms" },
    { name: "Push Notifications", checked: true, key: "push" },
  ]);

  const handleNotificationChange = (index) => {
    setNotifications(prev => 
      prev.map((notif, i) => 
        i === index ? { ...notif, checked: !notif.checked } : notif
      )
    );
  };

  return (
    <div className={`${theme.colors.secondary} ${theme.colors.border} border rounded-lg shadow-lg p-6`}>
      <h3 className={`text-lg font-semibold ${theme.colors.textAccent} mb-4`}>
        Preferences
      </h3>
      <div className="space-y-4">
        {/* Theme Toggle */}
        <div className={`flex justify-between items-center ${theme.colors.tertiary} rounded-md px-4 py-3`}>
          <label className={`${theme.colors.textPrimary} font-medium`}>
            Dark Mode
          </label>
          <button
            onClick={toggleTheme}
            className={`relative inline-flex items-center justify-center w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              currentTheme === 'dark' 
                ? "bg-[#34d3f5] hover:bg-cyan-400" 
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          >
            <span
              className={`inline-block w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                currentTheme === 'dark' ? "translate-x-3" : "-translate-x-3"
              }`}
            />
          </button>
        </div>

        {/* Notification Settings */}
        {notifications.map((notification, index) => (
          <div
            key={index}
            className={`flex justify-between items-center ${theme.colors.tertiary} rounded-md px-4 py-3`}
          >
            <label className={`${theme.colors.textPrimary}`}>{notification.name}</label>
            <input
              type="checkbox"
              checked={notification.checked}
              onChange={() => handleNotificationChange(index)}
              className={`w-5 h-5 cursor-pointer ${
                currentTheme === 'dark' 
                  ? 'accent-[#34d3f5]' 
                  : 'accent-blue-600'
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationSettings;

