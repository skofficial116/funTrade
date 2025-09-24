import React from "react";
import Footer from "../../components/student/Footer";

const Contact = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-800">
      <div className="max-w-5xl mx-auto px-6 py-12 flex-1">
        <h1 className="text-3xl font-bold mb-4 text-cyan-700">Contact</h1>
        <p className="text-gray-700 leading-7 mb-6">
          Reach out to us anytime. We typically respond within 1-2 business days.
        </p>
        <div className="space-y-2 text-gray-700">
          <p>Email: <a className="text-cyan-700" href="mailto:info@botaimeta.com">info@botaimeta.com</a></p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
