import { useContext } from "react";
import UserProfile from "../../components/educator/UserProfile";
import UserDetails from "../../components/educator/UserDetails";
import ChangePassword from "../../components/educator/ChangePassword";
import PhoneVerification from "../../components/educator/PhoneVerification";
import ThemeToggle from "../../components/common/ThemeToggle";
import { AppContext } from "../../context/AppContext";
import { useTheme } from "../../context/ThemeContext";

const MyAccountPage = () => {
  const { userData } = useContext(AppContext);
  const { theme } = useTheme();
  
  const user = {
    name: userData?.name || userData?.username || "Anonymous",
    email: userData?.email || "",
    phone: userData?.phone || "Not set",
    location: userData?.location || "Not set",
    bio: userData?.bio || "",
    memberSince: userData?.createdAt
      ? new Date(userData.createdAt).toLocaleDateString()
      : "",
    initials:
      (userData?.name || userData?.username || "U")
        .split(" ")
        .map((s) => s[0])
        .join("")
        .toUpperCase(),
    avatarUrl: userData?.avatarUrl || null,
  };

  return (
    <div className={`min-h-screen p-6 bg-gradient-to-br ${theme.colors.primary} ${theme.colors.textPrimary} space-y-6`}>
      <div className="flex justify-between items-center">
        <h2 className={`text-2xl font-bold ${theme.colors.textAccent}`}>My Account</h2>
        <div className="flex items-center space-x-4">
          <span className={`text-sm ${theme.colors.textSecondary}`}>Theme:</span>
          <ThemeToggle />
        </div>
      </div>

      {/* Profile Summary */}
      <UserProfile user={user} />

      {/* Personal Info */}
      <UserDetails user={user} />

      {/* Phone Verification */}
      <PhoneVerification phone={user.phone} />

      {/* Security Section */}
      <ChangePassword />
    </div>
  );
};

export default MyAccountPage;
