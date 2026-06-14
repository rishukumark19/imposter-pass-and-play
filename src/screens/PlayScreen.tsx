import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "../context/GameContext";

export default function PlayScreen() {
  const { state, dispatch } = useGame();
  const { players, starterPlayerId, settings } = state;

  const [timeLeft, setTimeLeft] = useState(settings.discussionTime);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const timerRef = useRef<number | null>(null);
  const starterPlayer = players.find((p) => p.id === starterPlayerId) || players[0];

  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
    }

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [isTimerRunning, timeLeft]);

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTimerRunning(false);
    setTimeLeft(settings.discussionTime);
  };

  const handleReveal = () => {
    dispatch({ type: "REVEAL_RESULTS" });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <motion.div
      className="w-full max-w-md mx-auto h-screen flex flex-col p-6 overflow-y-auto pb-24 scroll-smooth relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute top-[10%] left-[50%] -translate-x-1/2 w-full h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="z-10 w-full flex flex-col items-center gap-6">
        <div className="text-center">
          <span className="inline-block bg-white/10 text-white/80 text-xs font-bold px-3 py-1 rounded-full mb-3 tracking-widest uppercase shadow-sm">
            🗣️ Clue Round
          </span>
          <h2 className="text-3xl font-black text-white">Time to Argue</h2>
          <p className="text-white/50 text-sm mt-1">Put the phone down. Look at each other.</p>
        </div>

        {/* Starter Spotlight */}
        <div className="w-full glass-card p-6 flex flex-col items-center text-center gap-3 relative overflow-hidden border-secondary/30">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 blur-[50px]" />
          
          <motion.div
            className="w-20 h-20 rounded-full bg-secondary/20 border-2 border-secondary/50 flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(14,165,233,0.3)] z-10"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            {starterPlayer.avatar}
          </motion.div>
          
          <div className="z-10">
            <h3 className="text-xl font-bold">
              <span className="text-secondary">{starterPlayer.name}</span> Starts!
            </h3>
            <p className="text-white/60 text-sm mt-1">Say your one word clue.</p>
          </div>
        </div>

        {/* Discussion Timer */}
        <div 
          className="w-full glass-card p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors relative"
          onClick={toggleTimer}
        >
          <div className={`w-40 h-40 rounded-full border-4 flex flex-col items-center justify-center shadow-inner transition-colors duration-500 ${
            timeLeft === 0 ? "border-accent bg-accent/10" : isTimerRunning ? "border-primary bg-primary/10" : "border-white/20 bg-black/20"
          }`}>
            <span className={`text-5xl font-black tabular-nums tracking-tight ${timeLeft < 10 && timeLeft > 0 ? "text-accent animate-pulse" : "text-white"}`}>
              {formatTime(timeLeft)}
            </span>
            <span className="text-white/40 text-xs font-bold uppercase tracking-widest mt-2">
              {timeLeft === 0 ? "Time's Up!" : isTimerRunning ? "Tap to Pause" : "Tap to Start"}
            </span>
          </div>
          
          {timeLeft !== settings.discussionTime && (
            <button 
              onClick={resetTimer} 
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white/60 hover:text-white px-3 py-1 rounded-md text-xs font-bold transition-colors"
            >
              Reset
            </button>
          )}
        </div>

        {/* Reference speaking order */}
        <div className="w-full">
          <h4 className="text-white/50 text-sm font-bold uppercase tracking-widest mb-3 pl-2">Speaking Order</h4>
          <div className="flex flex-col gap-2">
            {players.map((p, index) => {
              const isStarter = p.id === starterPlayerId;
              return (
                <div key={p.id} className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  isStarter ? "bg-secondary/10 border border-secondary/30" : "bg-black/40 border border-white/5"
                }`}>
                  <span className="w-6 text-center text-white/30 font-bold text-sm">{index + 1}</span>
                  <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">{p.avatar}</span>
                  <span className={`font-medium ${isStarter ? "text-secondary" : "text-white/80"}`}>{p.name}</span>
                  {isStarter && <span className="ml-auto bg-secondary text-white text-[10px] font-black uppercase px-2 py-1 rounded-md shadow-sm">First</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-gradient-to-t from-dark via-dark to-transparent pb-6 z-20 flex justify-center">
        <div className="w-full max-w-md">
          <button 
            onClick={() => setShowConfirmModal(true)} 
            className="btn-primary"
          >
            🔍 Truth Time
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass-card max-w-sm w-full p-6 text-center"
            >
              <div className="text-5xl mb-4">🔍</div>
              <h2 className="text-2xl font-black mb-2 text-white">Reveal Results?</h2>
              <p className="text-white/60 text-sm mb-6">
                Are you sure everyone has voted? Once you reveal, there's no going back.
              </p>
              <div className="flex flex-col gap-3">
                <button onClick={handleReveal} className="w-full bg-accent text-white font-bold py-3 rounded-xl shadow-[0_0_15px_rgba(244,63,94,0.4)] hover:bg-accent/90 transition-all">
                  Show Us The Liar
                </button>
                <button onClick={() => setShowConfirmModal(false)} className="btn-secondary">
                  Not Yet
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
