import React from "react";
import Footer from "../../components/student/Footer";

const Features = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-800">
      <div className="max-w-5xl mx-auto px-6 py-12 flex-1">
        <h1 className="text-3xl font-bold mb-4 text-cyan-700">Features</h1>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>Secure authentication and session management</li>
          <li>Educator dashboard with wallet and analytics</li>
          <li>Responsive UI built with TailwindCSS</li>
        </ul>
      </div>
      <Footer />
    </div>
  );
};

export default Features;
