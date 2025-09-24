import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";

const timelineData = [
  {
    year: "2025",
    event: "Launching At Dubai",
    icon: "🚀",
    description:
      "Establishing our first international presence in the Middle East",
  },
  {
    year: "2026",
    event: "Launch Broker House",
    icon: "🏢",
    description: "Opening our comprehensive brokerage services",
  },
  {
    year: "2027",
    event: "UK Office Opening",
    icon: "🇬🇧",
    description: "Expanding operations to the European market",
  },
  {
    year: "2029",
    event: "List Company Share In London Stock Exchange",
    icon: "📈",
    description: "Going public and reaching new milestones",
  },
];

const Vision = () => {
  return (
    <section className="w-full bg-gradient-to-br from-purple-900 via-slate-900 to-slate-800 px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-16">
          Our Vision for the <span className="text-cyan-400">Future</span>
        </h2>

        <VerticalTimeline lineColor="rgba(34,211,238,0.4)">
          {timelineData.map((item, index) => (
            <VerticalTimelineElement
              key={index}
              icon={<span style={{ fontSize: "22px" }}>{item.icon}</span>}
              iconStyle={{
                background: "rgb(8,145,178)", // cyan-600
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              contentStyle={{
                background: "rgba(30,41,59,0.6)", // slate-800/60
                color: "rgb(226,232,240)", // slate-200
                border: "1px solid rgb(51,65,85)", // slate-700
                borderRadius: "0.75rem",
                backdropFilter: "blur(6px)",
              }}
              contentArrowStyle={{
                borderRight: "7px solid rgba(30,41,59,0.8)",
              }}
            >
              {/* 👇 Move year INSIDE the card */}
              <div className="text-cyan-400 font-semibold text-lg mb-2">
                {item.year}
              </div>
              <h3 className="text-xl font-bold text-white">{item.event}</h3>
              <p className="text-slate-300 leading-relaxed">
                {item.description}
              </p>
            </VerticalTimelineElement>
          ))}
        </VerticalTimeline>
      </div>
    </section>
  );
};

export default Vision;
