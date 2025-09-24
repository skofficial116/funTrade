import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import { useTheme } from "../../context/ThemeContext";
import { Upload } from "lucide-react";

const UserProfile = ({ user }) => {
  const { backendUrl, getToken, fetchUserData } = useContext(AppContext);
  const { theme } = useTheme();
  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setImage(file);
  };

  const handleUpload = async () => {
    if (!image) {
      toast.error('Please select an image first');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", image);

      const token = getToken();
      const response = await axios.post(
        `${backendUrl}/api/user/upload-avatar`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        toast.success('Avatar uploaded successfully!');
        await fetchUserData(); // Refresh user data to get new avatar
        setImage(null); // Clear selected file
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
      } else {
        toast.error(response.data.message || 'Failed to upload avatar');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload avatar');
    } finally {
      setIsUploading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className={`${theme.colors.secondary} rounded-lg shadow-lg p-6 ${theme.colors.border} border`}>
      <div className="flex items-center mb-4">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold overflow-hidden ${
          user?.avatarUrl ? 'bg-transparent' : 'bg-blue-500'
        }`}>
          {user?.avatarUrl ? (
            <img 
              src={user.avatarUrl} 
              alt="Avatar" 
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            getInitials(user?.name || user?.email)
          )}
        </div>
        <div className="ml-4">
          <h3 className={`text-lg font-semibold ${theme.colors.textAccent}`}>{user?.name || 'User'}</h3>
          <p className={`${theme.colors.textSecondary}`}>{user?.email}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className={`block text-sm font-medium ${theme.colors.textSecondary} mb-2`}>
            Upload Profile Picture
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={`block w-full text-sm ${theme.colors.textPrimary} ${theme.colors.input} ${theme.colors.border} border rounded-lg cursor-pointer focus:outline-none`}
          />
          {image && (
            <p className={`text-xs ${theme.colors.textSecondary} mt-1`}>
              Selected: {image.name}
            </p>
          )}
        </div>
        
        <button
          onClick={handleUpload}
          disabled={!image || isUploading}
          className={`${theme.colors.button} px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2`}
        >
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload size={16} />
              <span>Upload Avatar</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
