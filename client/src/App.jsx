import React from "react";
import { Route, Routes, useMatch } from "react-router-dom";
import "quill/dist/quill.snow.css";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./context/ThemeContext.jsx";

// Student Imports
import Home from "./pages/student/Home.jsx";
import Loading from "./components/student/Loading.jsx";
import About from "./pages/student/About.jsx";
import Help from "./pages/student/Help.jsx";
import Contact from "./pages/student/Contact.jsx";
import Liquidity from "./pages/student/Liquidity.jsx";
import Features from "./pages/student/Features.jsx";

// Educator Imports
import Dashboard from "./pages/dashboard/DashBoard.jsx";
import Navbar from "./components/student/Navbar.jsx";
import SignIn from "./pages/student/SignIn.jsx";
import SignUp from "./pages/student/SignUp.jsx";
import RequireAuth from "./components/common/RequireAuth.jsx";
/* react-phone-input-2 CSS */
import "react-phone-input-2/lib/style.css";

import axios from "axios";

axios.defaults.withCredentials = true;

const App = () => {
  const isEducatorRoute = useMatch("/dashboard/*");
  return (
    <ThemeProvider>
      <div className="text-default min-h-screen bg-white">
        <ToastContainer></ToastContainer>
        {!isEducatorRoute && <Navbar> </Navbar>}
        <Routes>
        {/* Student Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/loading/:path" element={<Loading />} />
        <Route path="/about" element={<About />} />
        <Route path="/help" element={<Help />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/liquidity" element={<Liquidity />} />
        <Route path="/features" element={<Features />} />

        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        {/* Educator Routes with Nested Routing */}
        {/* <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Dashboard />} /> 
        </Route> */}
        </Routes>
      </div>
    </ThemeProvider>
  );
};

export default App;
