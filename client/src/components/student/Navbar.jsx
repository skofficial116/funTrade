import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);

  return (
    <div className="flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-300 py-4 bg-cyan-200/90">
      {/* Logo */}
      <img
        onClick={() => navigate("/")}
        // src={assets.logo}
src={assets.file}
        alt="Logo"
        className="w-50 lg:w-60 cursor-pointer"
      />

      {/* Right Side */}
      <div className="flex items-center gap-3">
        {userData ? (
          <button
            onClick={() => navigate("/dashboard")}
            className="cursor-pointer bg-cyan-500 hover:bg-cyan-600 text-slate-900 px-5 py-2 rounded-lg font-semibold transition-colors duration-200"
          >
            Dashboard
          </button>
        ) : (
          <>
            <button
              onClick={() => navigate("/signin")}
              className="cursor-pointer bg-cyan-500 hover:bg-cyan-600 text-slate-900 px-5 py-2 rounded-lg font-semibold transition-colors duration-200"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="cursor-pointer bg-transparent border-2 border-slate-600 hover:text-white hover:border-slate-500 hover:bg-slate-800 text-slate-800 font-semibold px-5 py-2 rounded-lg transition-colors duration-200"
              // className="bg-blue-600 text-white px-5 py-2 rounded-full"
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
