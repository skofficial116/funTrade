import React from "react";
import Hero from "../../components/student/Hero";
import Vision from "../../components/student/Vision";
import Footer from "../../components/student/Footer";
import TradingStepsSection from "../../components/student/TradingSteps";

const Home = () => {
  return (
    <div className="flex flex-col items-center text-center ">
      <Hero></Hero>
      <TradingStepsSection></TradingStepsSection>
      
      <Vision></Vision>
      <Footer></Footer>
    </div>
  );
};

export default Home;
