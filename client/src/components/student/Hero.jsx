import React from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {


  const navigate = useNavigate();
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-purple-900 flex items-center justify-center px-4 py-16 w-full ">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
          Where AI Precision Meets Your Trading{" "}
          <span className="text-cyan-400">Ambition</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          Leverage our advanced, automated trading technology to navigate the
          markets with confidence. Your financial goals, amplified by
          intelligent systems.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <button className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-semibold px-8 py-4 rounded-lg transition-colors duration-200 w-full sm:w-auto cursor-pointer"  onClick={() => navigate("/signUp")}>
            Open a Free Account
          </button>
          <button className="bg-transparent border-2 border-slate-600 hover:border-slate-500 text-white font-semibold px-8 py-4 rounded-lg transition-colors duration-200 w-full sm:w-auto">
            Explore Features
          </button>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-8 backdrop-blur-sm border border-slate-700">
          <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* */}
              <linearGradient
                id="bgGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  style={{ stopColor: "#1e293b", stopOpacity: 1 }}
                />
                <stop
                  offset="50%"
                  style={{ stopColor: "#0f172a", stopOpacity: 1 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "#581c87", stopOpacity: 1 }}
                />
              </linearGradient>

              <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                <stop
                  offset="0%"
                  style={{ stopColor: "#06b6d4", stopOpacity: 0.2 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "#06b6d4", stopOpacity: 0 }}
                />
              </radialGradient>

              {/* */}
              <marker
                id="arrow"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#06b6d4" />
              </marker>
            </defs>

            {/* */}
            <rect width="400" height="300" fill="url(#bgGradient)" rx="8" />

            {/* */}
            <text
              x="200"
              y="30"
              textAnchor="middle"
              fill="#06b6d4"
              fontFamily="Arial, sans-serif"
              fontSize="16"
              fontWeight="bold"
            >
              Secure Data Flow
            </text>

            {/* */}
            <g id="user" transform="translate(60, 120)">
              <circle cx="0" cy="0" r="30" fill="url(#nodeGlow)" />
              <circle
                cx="0"
                cy="0"
                r="20"
                fill="#334155"
                stroke="#06b6d4"
                strokeWidth="2"
              />

              {/* */}
              <circle
                cx="0"
                cy="-5"
                r="6"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="1.5"
              />
              <path
                d="M-8,8 Q-8,2 0,2 Q8,2 8,8"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="1.5"
              />

              <text
                x="0"
                y="45"
                textAnchor="middle"
                fill="#94a3b8"
                fontFamily="Arial, sans-serif"
                fontSize="12"
                fontWeight="bold"
              >
                USER
              </text>
            </g>

            {/* */}
            <g id="security" transform="translate(200, 120)">
              <circle cx="0" cy="0" r="35" fill="url(#nodeGlow)" />
              <circle
                cx="0"
                cy="0"
                r="25"
                fill="#334155"
                stroke="#06b6d4"
                strokeWidth="2"
              />

              {/* */}
              <path
                d="M-8,-10 L0,-15 L8,-10 L8,5 Q8,8 0,12 Q-8,8 -8,5 Z"
                fill="#06b6d4"
                opacity="0.8"
              />
              <rect
                x="-3"
                y="-2"
                width="6"
                height="4"
                fill="#0f172a"
                stroke="#06b6d4"
                strokeWidth="0.8"
                rx="1"
              />
              <path
                d="M-2,-2 Q-2,-5 0,-5 Q2,-5 2,-2"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="0.8"
              />

              {/* */}
              <circle
                cx="0"
                cy="0"
                r="25"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="1"
                opacity="0.3"
              >
                <animate
                  attributeName="r"
                  values="25;35;25"
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.5;0.1;0.5"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>

              <text
                x="0"
                y="55"
                textAnchor="middle"
                fill="#94a3b8"
                fontFamily="Arial, sans-serif"
                fontSize="12"
                fontWeight="bold"
              >
                AI SECURITY
              </text>
            </g>

            {/* */}
            <g id="server" transform="translate(340, 120)">
              <circle cx="0" cy="0" r="30" fill="url(#nodeGlow)" />
              <circle
                cx="0"
                cy="0"
                r="20"
                fill="#334155"
                stroke="#06b6d4"
                strokeWidth="2"
              />

              {/* */}
              <rect
                x="-8"
                y="-8"
                width="16"
                height="6"
                rx="1"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="1.5"
              />
              <rect
                x="-8"
                y="-1"
                width="16"
                height="6"
                rx="1"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="1.5"
              />
              <rect
                x="-8"
                y="6"
                width="16"
                height="6"
                rx="1"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="1.5"
              />

              {/* */}
              <circle cx="-5" cy="-5" r="1" fill="#10b981" />
              <circle cx="-5" cy="2" r="1" fill="#06b6d4" />
              <circle cx="-5" cy="9" r="1" fill="#10b981" />

              <text
                x="0"
                y="45"
                textAnchor="middle"
                fill="#94a3b8"
                fontFamily="Arial, sans-serif"
                fontSize="12"
                fontWeight="bold"
              >
                SERVER
              </text>
            </g>

            {/* */}
            <g id="dataFlow">
              {/* */}
              <path
                d="M90,120 L165,120"
                stroke="#06b6d4"
                strokeWidth="2"
                markerEnd="url(#arrow)"
              />
              <text
                x="127"
                y="110"
                textAnchor="middle"
                fill="#06b6d4"
                fontFamily="Arial, sans-serif"
                fontSize="10"
              >
                ENCRYPTED
              </text>

              {/* */}
              <path
                d="M235,120 L310,120"
                stroke="#06b6d4"
                strokeWidth="2"
                markerEnd="url(#arrow)"
              />
              <text
                x="272"
                y="110"
                textAnchor="middle"
                fill="#06b6d4"
                fontFamily="Arial, sans-serif"
                fontSize="10"
              >
                PROTECTED
              </text>

              {/* */}
              <circle r="3" fill="#06b6d4" opacity="0.8">
                <animateMotion dur="3s" repeatCount="indefinite">
                  <mpath href="#flowPath" />
                </animateMotion>
              </circle>
            </g>

            {/* */}
            <text
              x="200"
              y="220"
              textAnchor="middle"
              fill="#94a3b8"
              fontFamily="Arial, sans-serif"
              fontSize="12"
            >
              End-to-End Encryption • Real-Time Protection • Secure Storage
            </text>

            {/* */}
            <defs>
              <path
                id="flowPath"
                d="M90,120 L165,120 L235,120 L310,120"
                fill="none"
              />
            </defs>
          </svg>
        </div>
      </div>
    </section>
  );
};
export default Hero;
