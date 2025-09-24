import { useState, useContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { useTheme } from "../../context/ThemeContext";

const UserDetails = ({ user }) => {
  const { backendUrl, getToken, fetchUserData } = useContext(AppContext);
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    phone: user.phone || "",
    location: user.location || "",
    bio: user.bio || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const token = getToken();
      if (!token) {
        toast.error("Not authenticated");
        return;
      }

      const { data } = await axios.put(
        `${backendUrl}/api/user/profile`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        await fetchUserData(); // Refresh user data
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || "",
      phone: user.phone || "",
      location: user.location || "",
      bio: user.bio || "",
    });
    setIsEditing(false);
  };

  const userInfo = [
    { label: "Full Name", key: "name", value: user.name, editable: true },
    { label: "Phone", key: "phone", value: user.phone, editable: true },
    { label: "Location", key: "location", value: user.location, editable: true },
    { label: "Member Since", key: "memberSince", value: user.memberSince, editable: false },
  ];

  return (
    <div className={`${theme.colors.secondary} rounded-lg shadow-lg p-6 ${theme.colors.border} border`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-lg font-semibold ${theme.colors.textAccent}`}>
          Personal Information
        </h3>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className={`px-4 py-2 rounded-lg transition-colors ${theme.colors.button}`}
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg transition-colors ${theme.colors.success} disabled:opacity-50`}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg transition-colors ${theme.colors.buttonSecondary}`}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {userInfo.map((info, idx) => (
          <div
            key={idx}
            className={`${theme.colors.tertiary} p-4 rounded-lg ${theme.colors.borderAccent} border`}
          >
            <label className={`block text-sm font-medium ${theme.colors.textAccent} mb-1`}>
              {info.label}
            </label>
            {isEditing && info.editable ? (
              <input
                type="text"
                name={info.key}
                value={formData[info.key] || ""}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 rounded-lg ${theme.colors.input} ${theme.colors.border} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder={`Enter ${info.label.toLowerCase()}`}
              />
            ) : (
              <p className={`${theme.colors.textPrimary}`}>
                {info.value || "Not set"}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Bio Section */}
      <div className={`mt-4 ${theme.colors.tertiary} p-4 rounded-lg ${theme.colors.borderAccent} border`}>
        <label className={`block text-sm font-medium ${theme.colors.textAccent} mb-1`}>
          Bio
        </label>
        {isEditing ? (
          <textarea
            name="bio"
            value={formData.bio || ""}
            onChange={handleInputChange}
            rows={3}
            className={`w-full px-3 py-2 rounded-lg ${theme.colors.input} ${theme.colors.border} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Tell us about yourself..."
          />
        ) : (
          <p className={`${theme.colors.textPrimary}`}>
            {user.bio || "No bio added yet"}
          </p>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
