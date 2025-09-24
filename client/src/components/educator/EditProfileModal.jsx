import { useState } from "react";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const EditProfileModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    location: "",
    email: "",
    profilePic: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async () => {
    const formDataObj = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataObj.append(key, value);
    });

    try {
      await axios.post(`${backendUrl}/user/updateProfile/`, formDataObj, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Profile updated successfully");
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to update profile");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>

        <input
          name="fullName"
          placeholder="Full Name"
          className="w-full mb-2 p-2 border rounded"
          onChange={handleChange}
        />
        <input
          name="phone"
          placeholder="Phone Number"
          className="w-full mb-2 p-2 border rounded"
          onChange={handleChange}
        />
        <input
          name="location"
          placeholder="Location"
          className="w-full mb-2 p-2 border rounded"
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email"
          type="email"
          className="w-full mb-2 p-2 border rounded"
          onChange={handleChange}
        />
        <input
          type="file"
          name="profilePic"
          className="w-full mb-4"
          onChange={handleChange}
        />

        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-cyan-500 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
