import React from "react";
import Footer from "../../components/student/Footer";

const About = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-800">
      <div className="max-w-5xl mx-auto px-6 py-12 flex-1">
        <h1 className="text-3xl font-bold mb-4 text-cyan-700">About Us</h1>
        <p className="text-gray-700 leading-7">
          We are building an education platform powered by modern technology.
          Our mission is to enable educators and students to collaborate and
          succeed through intuitive tools, clear analytics, and secure
          infrastructure.
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default About;
