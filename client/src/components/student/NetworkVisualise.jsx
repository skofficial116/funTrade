// NetworkVisualise.jsx
import React, { useEffect, useRef, useState } from "react";

const NetworkVisualise = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Generate nodes and connections
  useEffect(() => {
    const nodeCount = 50;
    const newNodes = [];
    const newConnections = [];

    for (let i = 0; i < nodeCount; i++) {
      newNodes.push({
        id: i,
        x: (Math.random() - 0.5) * 800,
        y: (Math.random() - 0.5) * 400,
        z: (Math.random() - 0.5) * 200,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        vz: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 3 + 2,
        pulse: Math.random() * Math.PI * 2,
        color: {
          r: Math.random() * 0.5 + 0.5,
          g: Math.random() * 0.8 + 0.2,
          b: 1,
          a: Math.random() * 0.5 + 0.5,
        },
      });
    }

    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dx = newNodes[i].x - newNodes[j].x;
        const dy = newNodes[i].y - newNodes[j].y;
        const dz = newNodes[i].z - newNodes[j].z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (distance < 150 && Math.random() > 0.7) {
          newConnections.push({
            from: i,
            to: j,
            strength: Math.random() * 0.5 + 0.1,
            pulse: Math.random() * Math.PI * 2,
          });
        }
      }
    }

    setNodes(newNodes);
    setConnections(newConnections);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded || nodes.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let time = 0;
    let isAnimating = true;

    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    const animatedNodes = nodes.map((node) => ({ ...node }));

    const animate = () => {
      if (!isAnimating) return;
      time += 0.016;

      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      ctx.fillStyle = "rgba(15,23,42,0.02)";
      ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

      const centerX = canvas.clientWidth / 2;
      const centerY = canvas.clientHeight / 2;

      animatedNodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;
        node.z += node.vz;

        if (node.x > 400 || node.x < -400) node.vx *= -1;
        if (node.y > 200 || node.y < -200) node.vy *= -1;
        if (node.z > 100 || node.z < -100) node.vz *= -1;

        const orbit = time * 0.1;
        node.x += Math.sin(orbit + node.id * 0.1) * 0.2;
        node.y += Math.cos(orbit + node.id * 0.15) * 0.15;
      });

      // Draw connections
      ctx.lineWidth = 1;
      connections.forEach((conn) => {
        const from = animatedNodes[conn.from];
        const to = animatedNodes[conn.to];
        const pulse = Math.sin(time * 3 + conn.pulse) * 0.4 + 0.6;
        const alpha = conn.strength * pulse * 0.8;

        const fromX =
          from.x * Math.cos(time * 0.2) - from.z * Math.sin(time * 0.2);
        const fromY = from.y;
        const toX = to.x * Math.cos(time * 0.2) - to.z * Math.sin(time * 0.2);
        const toY = to.y;

        ctx.strokeStyle = `rgba(34, 211, 238, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(centerX + fromX, centerY + fromY);
        ctx.lineTo(centerX + toX, centerY + toY);
        ctx.stroke();
      });

      // Draw nodes
      animatedNodes.forEach((node) => {
        const rotatedX =
          node.x * Math.cos(time * 0.2) - node.z * Math.sin(time * 0.2);
        const rotatedZ =
          node.x * Math.sin(time * 0.2) + node.z * Math.cos(time * 0.2);
        const rotatedY = node.y + Math.sin(time + node.id) * 10;

        const screenX = centerX + rotatedX;
        const screenY = centerY + rotatedY;

        const scale = Math.max(0.3, (400 + rotatedZ) / 400);
        const size = node.size * scale;

        const pulse = Math.sin(time * 4 + node.pulse) * 0.4 + 0.8;
        const alpha = Math.max(0.2, node.color.a * pulse * scale);

        if (
          screenX < -50 ||
          screenX > canvas.clientWidth + 50 ||
          screenY < -50 ||
          screenY > canvas.clientHeight + 50
        )
          return;

        const glowSize = size * 4;
        const gradient = ctx.createRadialGradient(
          screenX,
          screenY,
          0,
          screenX,
          screenY,
          glowSize
        );
        gradient.addColorStop(0, `rgba(34,211,238,${alpha * 0.3})`);
        gradient.addColorStop(0.4, `rgba(34,211,238,${alpha * 0.1})`);
        gradient.addColorStop(1, "rgba(34,211,238,0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(screenX, screenY, glowSize, 0, Math.PI * 2);
        ctx.fill();

        const nodeGradient = ctx.createRadialGradient(
          screenX - size * 0.3,
          screenY - size * 0.3,
          0,
          screenX,
          screenY,
          size
        );
        nodeGradient.addColorStop(0, `rgba(255,255,255,${alpha * 0.9})`);
        nodeGradient.addColorStop(0.3, `rgba(34,211,238,${alpha})`);
        nodeGradient.addColorStop(1, `rgba(14,165,233,${alpha * 0.7})`);

        ctx.fillStyle = nodeGradient;
        ctx.beginPath();
        ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255,255,255,${alpha * 0.6})`;
        ctx.beginPath();
        ctx.arc(
          screenX - size * 0.2,
          screenY - size * 0.2,
          size * 0.2,
          0,
          Math.PI * 2
        );
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      isAnimating = false;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, [isLoaded, nodes, connections]);

  return (
    <div className="w-full h-full relative overflow-hidden rounded-lg bg-slate-900/50 border border-slate-600 flex flex-col">
      {/* Loading */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-slate-400 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-sm">Loading AI Network...</p>
          </div>
        </div>
      )}

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          background:
            "linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(30,41,59,0.8) 100%)",
        }}
      />

      {/* Overlay UI */}
      <div className="absolute top-4 left-4 text-slate-400 text-xs z-20">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded px-2 py-1 border border-slate-600">
          <span className="text-cyan-400 font-mono">●</span> {nodes.length}{" "}
          Active Nodes
        </div>
      </div>

      <div className="absolute top-4 right-4 text-slate-400 text-xs z-20">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded px-2 py-1 border border-slate-600">
          <span className="text-green-400 font-mono">⚡</span>{" "}
          {connections.length} Connections
        </div>
      </div>

      {/* <div className="absolute bottom-4 left-4 text-slate-400 text-xs z-20">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded px-2 py-1 border border-slate-600">
          <span className="text-purple-400 font-mono">🧠</span> AI Network
          Active
        </div>
      </div> */}

      <div className="absolute bottom-4 right-4 text-slate-500 text-xs opacity-0 hover:opacity-100 transition-opacity duration-300 z-20">
        <div className="bg-slate-800/80 backdrop-blur-sm rounded px-3 py-2 border border-slate-600">
          Real-time Neural Network Visualization
        </div>
      </div>

      {/* Label at the top */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-slate-300 text-m z-20">
        Network Visualization
      </div>
    </div>
  );
};

export default NetworkVisualise;
