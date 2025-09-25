import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4 w-full m-0">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-8">
          {/* About Section - Takes more space */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-cyan-400 text-lg font-semibold mb-4">About</h3>
            <div className="flex items-center space-x-2 mb-4">
              <img
                src="https://via.placeholder.com/120x40/1f2937/cyan?text=BOT+AI+META"
                alt="BOT AI META"
                className="h-8"
              />
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Forex Trading Experts, powered by advanced AI technology.
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="space-y-4">
            <h3 className="text-cyan-400 text-lg font-semibold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 text-sm block"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/liquidity"
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 text-sm block"
                >
                  Liquidity
                </Link>
              </li>
              <li>
                <Link
                  to="/features"
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 text-sm block"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 text-sm block"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Get Started Section */}
          <div className="space-y-4">
            <h3 className="text-cyan-400 text-lg font-semibold mb-4">
              Get Started
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/signin"
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 text-sm block"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 text-sm block"
                >
                  Sign Up
                </Link>
              </li>
              <li>
                <Link
                  to="/help"
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 text-sm block"
                >
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h3 className="text-cyan-400 text-lg font-semibold mb-4">
              Contact
            </h3>
            <div className="space-y-2">
              <a
                href="mailto:info@botaimeta.com"
                className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 text-sm block"
              >
                info@botaimeta.com
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-6">
          {/* Copyright */}
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              Copyright © 2024 BOT AI META. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
