import { useTheme } from "../../context/ThemeContext";

const ThemeToggle = ({ className = "" }) => {
  const { currentTheme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
        isDark 
          ? "bg-[#34d3f5] hover:bg-cyan-400" 
          : "bg-gray-300 hover:bg-gray-400"
      } ${className}`}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      <span
        className={`inline-block w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
          isDark ? "translate-x-3" : "-translate-x-3"
        }`}
      />
      <span className="sr-only">
        {isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      </span>
    </button>
  );
};

export default ThemeToggle;
