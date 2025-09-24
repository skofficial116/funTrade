// TradingStepsSection.jsx
import NetworkVisualise from "./NetworkVisualise";

const TradingStepsSection = () => {
  const steps = [
    {
      number: "01",
      title: "Create Account",
      description:
        "Join in minutes with our secure and streamlined onboarding process. Your portal to intelligent trading awaits.",
    },
    {
      number: "02",
      title: "Fund Securely",
      description:
        "Deposit funds with peace of mind. We utilize top-tier encryption and security protocols to protect your capital.",
    },
    {
      number: "03",
      title: "Activate & Trade",
      description:
        "Deploy our AI-driven strategies. Trade forex, commodities, and more with unparalleled speed and efficiency.",
    },
  ];

  const advantages = [
    {
      title: "Prudent Risk Management",
      description:
        "Our systems ensure you and your capital are never over-exposed. We are built to withstand market volatility without service interruptions.",
    },
    {
      title: "Negative Balance Protection",
      description:
        "A legally-binding policy that guarantees your account can never go into negative balance, protecting your investment.",
    },
    {
      title: "Tier 1 Liquidity",
      description:
        "Gain access to deep liquidity, ensuring fast execution and competitive spreads across all major trading pairs.",
    },
  ];

  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900 px-4 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Trading Steps */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-16">
            A <span className="text-cyan-400">Smarter Way</span> to Trade in 3
            Steps
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 hover:bg-slate-800/70 transition-colors duration-300"
              >
                <div className="text-cyan-400 font-bold text-lg mb-4">
                  {step.number}. {step.title}
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* BOT AI META Advantage */}
        <div className="grid lg:grid-cols-2 gap-12 items-stretch">
          {/* Left Column */}
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              The <span className="text-cyan-400">BOT AI META</span> Advantage
            </h2>

            <div className="space-y-8">
              {advantages.map((advantage, index) => (
                <div key={index}>
                  <div className="flex items-center mb-3">
                    <svg
                      className="w-6 h-6 text-cyan-400 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <h3 className="text-xl font-semibold text-white">
                      {advantage.title}
                    </h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {advantage.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="flex">
            <NetworkVisualise className="w-full h-full" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TradingStepsSection;
