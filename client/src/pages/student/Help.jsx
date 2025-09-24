import React from "react";
import Footer from "../../components/student/Footer";

const Help = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-800">
      <div className="max-w-5xl mx-auto px-6 py-12 flex-1">
        <h1 className="text-3xl font-bold mb-4 text-cyan-700">Help Center</h1>
        <p className="text-gray-700 leading-7 mb-6">
          Find answers to frequently asked questions and learn how to use the
          platform effectively.
        </p>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>How to create an account and sign in</li>
          <li>Managing your profile and security</li>
          <li>Understanding dashboard analytics</li>
          <li>Contacting support</li>
        </ul>
      </div>
      <Footer />
    </div>
  );
};

export default Help;
