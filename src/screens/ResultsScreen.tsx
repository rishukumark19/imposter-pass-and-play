import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useGame } from "../context/GameContext";

// Simple confetti burst
function launchConfetti(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const W = (canvas.width = window.innerWidth);
  const H = (canvas.height = window.innerHeight);
  const particles: any[] = [];
  const colors = ["#6d28d9", "#0ea5e9", "#f43f5e", "#FFB547", "#47B5FF", "#FF6B9D"];

  for (let i = 0; i < 120; i++) {
    particles.push({
      x: W / 2 + (Math.random() - 0.5) * 100,
      y: H / 2,
      vx: (Math.random() - 0.5) * 15,
      vy: Math.random() * -18 - 3,
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
    ctx!.clearRect(0, 0, W, H);
    particles.forEach((p) => {
      p.x += p.vx;
      p.vy += p.gravity;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      p.opacity = Math.max(0, p.opacity - 0.006);

      ctx!.save();
      ctx!.translate(p.x, p.y);
      ctx!.rotate((p.rotation * Math.PI) / 180);
      ctx!.globalAlpha = p.opacity;
      ctx!.fillStyle = p.color;
      ctx!.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx!.restore();
    });

    frame++;
    if (frame < 150) requestAnimationFrame(draw);
    else ctx!.clearRect(0, 0, W, H);
  }
  draw();
}

export default function ResultsScreen() {
  const { state, dispatch } = useGame();
  const { players, imposterIds, realWord, imposterWord, settings } = state;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      setTimeout(() => launchConfetti(canvasRef.current!), 300);
    }
  }, []);

  const handlePlayAgain = () => {
    dispatch({ type: "START_ROUND" });
  };

  const handleEditSetup = () => {
    dispatch({ type: "PLAY_AGAIN" }); 
  };

  const handleGoHome = () => {
    dispatch({ type: "RESET_GAME" });
  };

  return (
    <motion.div
      className="w-full max-w-md mx-auto h-screen flex flex-col items-center justify-start p-6 overflow-y-auto pb-24 scroll-smooth relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />
      
      {/* Background glow specific to Results */}
      <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="z-10 w-full flex flex-col items-center gap-8 pt-4">
        
        <motion.div
          className="flex flex-col items-center text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <span className="text-6xl mb-4 drop-shadow-lg">🔎</span>
          <h1 className="text-4xl font-black bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">Truth Time</h1>
          <p className="text-white/60 font-medium mt-2">Here's what everyone was talking about.</p>
        </motion.div>

        {/* Word comparison card */}
        <div className="w-full glass-card p-1">
          <div className="bg-black/40 rounded-xl p-5 flex flex-col gap-4">
            <div className="flex flex-col items-center text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-white/50 mb-1">Civilian Truth</span>
              <span className="text-2xl font-black text-secondary">{realWord}</span>
            </div>
            
            <div className="w-full h-px bg-white/10 relative">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/40 px-2 text-xs font-black text-white/30 uppercase">VS</div>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-white/50 mb-1">Imposter Lie</span>
              <span className="text-2xl font-black text-accent drop-shadow-[0_0_10px_rgba(244,63,94,0.3)]">
                {settings.trickRound ? "No Imposter!" : imposterWord || "???"}
              </span>
            </div>
          </div>
        </div>

        {/* Roles list */}
        <div className="w-full mt-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-white/50 mb-4 pl-2">The Squad</h3>
          <div className="flex flex-col gap-3">
            {players.map((p) => {
              const isImp = imposterIds.includes(p.id);
              return (
                <div key={p.id} className={`flex items-center gap-3 p-3 rounded-xl transition-all border ${
                  isImp 
                    ? "bg-accent/10 border-accent/30 shadow-[0_0_15px_rgba(244,63,94,0.15)]" 
                    : "glass border-white/5"
                }`}>
                  <span className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl shadow-inner">{p.avatar}</span>
                  <span className={`font-bold text-lg ${isImp ? "text-accent" : "text-white"}`}>{p.name}</span>
                  <div className="ml-auto">
                    {isImp ? (
                      <span className="bg-accent text-white text-xs font-black uppercase px-3 py-1.5 rounded-lg shadow-sm">🕵️ Fake</span>
                    ) : (
                      <span className="bg-white/10 text-white/60 text-xs font-bold uppercase px-3 py-1.5 rounded-lg">Real</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Floating Actions */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-gradient-to-t from-dark via-dark to-transparent pb-6 z-20 flex justify-center">
        <div className="w-full max-w-md flex flex-col gap-3">
          <button onClick={handlePlayAgain} className="btn-primary shadow-[0_0_30px_rgba(109,40,217,0.3)]">
            🔄 Play Again (Same Squad)
          </button>
          <div className="flex gap-3">
            <button onClick={handleEditSetup} className="btn-secondary flex-1 text-sm py-3">
              ⚙️ Change Rules
            </button>
            <button onClick={handleGoHome} className="btn-secondary flex-1 text-sm py-3 bg-white/5">
              🏠 Menu
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
