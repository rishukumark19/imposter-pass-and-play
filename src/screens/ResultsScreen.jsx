import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useGame, PHASES } from "../context/GameContext";
import "./ResultsScreen.css";

// Simple confetti burst
function launchConfetti(canvas) {
  const ctx = canvas.getContext("2d");
  const W = (canvas.width = window.innerWidth);
  const H = (canvas.height = window.innerHeight);
  const particles = [];
  const colors = ["#7C5CFF", "#00D4AA", "#FF4D6A", "#FFB547", "#47B5FF", "#FF6B9D"];

  for (let i = 0; i < 100; i++) {
    particles.push({
      x: W / 2 + (Math.random() - 0.5) * 100,
      y: H / 2,
      vx: (Math.random() - 0.5) * 12,
      vy: Math.random() * -15 - 3,
      w: Math.random() * 8 + 4,
      h: Math.random() * 5 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      gravity: 0.25 + Math.random() * 0.15,
      opacity: 1,
    });
  }

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p) => {
      p.x += p.vx;
      p.vy += p.gravity;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      p.opacity = Math.max(0, p.opacity - 0.006);

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });

    frame++;
    if (frame < 120) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, W, H);
  }
  draw();
}

export default function ResultsScreen() {
  const { state, dispatch } = useGame();
  const { players, imposterIds, realWord, imposterWord, settings } = state;
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      setTimeout(() => launchConfetti(canvasRef.current), 500);
    }
  }, []);

  const handlePlayAgain = () => {
    dispatch({ type: "START_ROUND" });
  };

  const handleEditSetup = () => {
    dispatch({ type: "PLAY_AGAIN" }); // Transitions back to SETUP phase
  };

  const handleGoHome = () => {
    dispatch({ type: "RESET_GAME" });
  };

  // Find the imposter details
  const imposters = players.filter((p) => imposterIds.includes(p.id));

  return (
    <motion.div
      className="screen results-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <canvas ref={canvasRef} className="confetti-canvas" />
      <div className="glow-orb glow-orb-1" />

      <div className="screen-content z-1 scrollable results-scroll">
        <motion.div
          className="results-hero text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <span className="results-icon">🔎</span>
          <h1 className="text-accent">Round Reveal</h1>
          <p>Here is what was going on</p>
        </motion.div>

        {/* Word comparison card */}
        <div className="card results-words-card">
          <div className="word-comparison">
            <div className="word-comp-item">
              <span className="word-comp-label">💬 Civilian Word</span>
              <span className="word-comp-value text-success">{realWord}</span>
            </div>
            <div className="word-comp-divider" />
            <div className="word-comp-item">
              <span className="word-comp-label">🕵️ Imposter Word</span>
              <span className="word-comp-value text-danger">
                {settings.trickRound ? "No Imposter!" : imposterWord || "???"}
              </span>
            </div>
          </div>
        </div>

        {/* Roles list */}
        <div className="roles-list-container w-full">
          <h3>Player Roles</h3>
          <div className="roles-list">
            {players.map((p) => {
              const isImp = imposterIds.includes(p.id);
              return (
                <div key={p.id} className={`role-card-item ${isImp ? "role-card-imposter" : "role-card-civilian"}`}>
                  <span className="avatar avatar-sm">{p.avatar}</span>
                  <span className="role-card-name">{p.name}</span>
                  <span className="role-card-badge">
                    {isImp ? "🕵️ Imposter" : "Civilian"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="results-actions w-full flex-col gap-sm">
          <button onClick={handlePlayAgain} className="btn btn-primary btn-block btn-lg">
            🔄 Play Again (Same Players)
          </button>
          <button onClick={handleEditSetup} className="btn btn-secondary btn-block">
            ⚙️ Change Settings / Players
          </button>
          <button onClick={handleGoHome} className="btn btn-ghost btn-block">
            🏠 Back to Home
          </button>
        </div>
      </div>
    </motion.div>
  );
}
