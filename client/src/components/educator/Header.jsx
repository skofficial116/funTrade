import { Bars3Icon } from "@heroicons/react/24/outline";
import { Menu } from "lucide-react";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { useTheme } from "../../context/ThemeContext";

const Header = ({ setSidebarOpen }) => {
  const { userData } = useContext(AppContext);
  const { theme } = useTheme();

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className={`${theme.colors.secondary} shadow-sm ${theme.colors.border} border-b h-16 flex items-center justify-between px-6`}>
      <button
        onClick={() => setSidebarOpen(true)}
        className={`lg:hidden p-2 rounded-md ${theme.colors.textSecondary} hover:${theme.colors.textPrimary}`}
      >
        <Menu size={20} />
      </button>
      
      <div className="flex items-center space-x-4">
        <span className={`${theme.colors.textSecondary}`}>Welcome back!</span>
        
        {/* Avatar display only */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold relative overflow-hidden ${
          userData?.avatarUrl ? 'bg-transparent' : 'bg-blue-500'
        }`}>
          {userData?.avatarUrl ? (
            <img 
              src={userData.avatarUrl} 
              alt="Avatar" 
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            getInitials(userData?.name || userData?.email)
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;