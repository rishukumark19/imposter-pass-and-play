import { motion } from "framer-motion";
import { useGame, PHASES } from "../context/GameContext";

export default function HomeScreen() {
  const { setPhase } = useGame();

  return (
    <motion.div
      className="w-full max-w-md mx-auto h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.4 }}
    >
      {/* Premium Glow Backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-primary/30 rounded-full blur-[100px] animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-secondary/30 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '1.5s' }} />

      <div className="z-10 w-full flex flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <motion.div
            className="text-8xl filter drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
          >
            🕵️
          </motion.div>

          <motion.h1
            className="text-5xl font-black tracking-tight"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent drop-shadow-sm">
              IMPOSTER
            </span>
          </motion.h1>

          <motion.p
            className="text-lg text-white/70 font-medium max-w-xs"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            One word. One liar. Find them.
          </motion.p>
        </div>

        <motion.div
          className="w-full flex justify-center"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <button
            className="btn-primary flex items-center justify-center gap-2 text-xl tracking-wide"
            onClick={() => setPhase(PHASES.SETUP)}
          >
            <span>Start the Chaos</span>
            <span>🎮</span>
          </button>
        </motion.div>

        <motion.p
          className="text-sm text-white/40 font-medium text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Offline-first. Pass the phone. Start arguing.
        </motion.p>
      </div>
    </motion.div>
  );
}
