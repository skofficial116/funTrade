import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const SignUp = () => {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/signup`,
        formData,
        { withCredentials: true }
      );

      if (data.success) {
        toast.success("Account created! Please sign in.");
        navigate("/signin");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#033e5b] to-[#012c42] ">
      <div className="bg-[#0c0f15] shadow-2xl rounded-lg p-8 w-full max-w-md border border-[#1a2230]">
        <h2 className="text-2xl font-bold text-center text-[#34d3f5] mb-6">
          Create Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full px-4 py-2 bg-transparent border border-[#2a2f3a] rounded-lg text-[#e0e6f0] placeholder-gray-400 focus:ring-2 focus:ring-[#34d3f5] focus:outline-none"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email address"
            className="w-full px-4 py-2 bg-transparent border border-[#2a2f3a] rounded-lg text-[#e0e6f0] placeholder-gray-400 focus:ring-2 focus:ring-[#34d3f5] focus:outline-none"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-2 bg-transparent border border-[#2a2f3a] rounded-lg text-[#e0e6f0] placeholder-gray-400 focus:ring-2 focus:ring-[#34d3f5] focus:outline-none"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#34d3f5] hover:bg-cyan-400 text-black font-semibold py-2 rounded-lg transition duration-200 shadow-lg"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-center text-[#e0e6f0]">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/signin")}
            className="text-[#34d3f5] hover:underline cursor-pointer"
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
