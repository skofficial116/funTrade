import { useState, useContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { useTheme } from "../../context/ThemeContext";

const ChangePassword = () => {
  const { backendUrl, getToken } = useContext(AppContext);
  const { theme } = useTheme();
  const [form, setForm] = useState({ 
    currentPassword: "", 
    newPassword: "", 
    confirmPassword: "" 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.currentPassword || !form.newPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (form.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    try {
      const token = getToken();
      if (!token) {
        toast.error("Not authenticated");
        return;
      }

      const { data } = await axios.post(
        `${backendUrl}/api/user/change-password`, 
        {
          currentPassword: form.currentPassword,
          newPassword: form.newPassword
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Password changed successfully!");
        setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        toast.error(data.message || "Failed to change password");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error changing password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${theme.colors.secondary} rounded-lg shadow-lg p-6 ${theme.colors.border} border`}>
      <h3 className={`text-lg font-semibold ${theme.colors.textAccent} mb-4`}>
        Change Password
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Current Password */}
        <div>
          <label className={`block text-sm font-medium ${theme.colors.textSecondary} mb-1`}>
            Current Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.current ? "text" : "password"}
              name="currentPassword"
              placeholder="Enter current password"
              value={form.currentPassword}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 pr-10 rounded-lg ${theme.colors.input} ${theme.colors.border} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('current')}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${theme.colors.textSecondary} hover:${theme.colors.textPrimary}`}
            >
              {showPasswords.current ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className={`block text-sm font-medium ${theme.colors.textSecondary} mb-1`}>
            New Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.new ? "text" : "password"}
              name="newPassword"
              placeholder="Enter new password"
              value={form.newPassword}
              onChange={handleChange}
              required
              minLength={6}
              className={`w-full px-3 py-2 pr-10 rounded-lg ${theme.colors.input} ${theme.colors.border} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${theme.colors.textSecondary} hover:${theme.colors.textPrimary}`}
            >
              {showPasswords.new ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className={`block text-sm font-medium ${theme.colors.textSecondary} mb-1`}>
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.confirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm new password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 pr-10 rounded-lg ${theme.colors.input} ${theme.colors.border} border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                form.newPassword && form.confirmPassword && form.newPassword !== form.confirmPassword 
                  ? 'border-red-500' 
                  : ''
              }`}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${theme.colors.textSecondary} hover:${theme.colors.textPrimary}`}
            >
              {showPasswords.confirm ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
          {form.newPassword && form.confirmPassword && form.newPassword !== form.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">Passwords don't match</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !form.currentPassword || !form.newPassword || form.newPassword !== form.confirmPassword}
          className={`w-full px-4 py-2 rounded-lg transition-colors ${theme.colors.button} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLoading ? "Updating Password..." : "Update Password"}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
