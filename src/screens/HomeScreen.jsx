import { motion } from "framer-motion";
import { useGame, PHASES } from "../context/GameContext";
import "./HomeScreen.css";

export default function HomeScreen() {
  const { setPhase } = useGame();

  return (
    <motion.div
      className="screen home-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.4 }}
    >
      <div className="glow-orb glow-orb-1" />
      <div className="glow-orb glow-orb-2" />

      <div className="screen-content z-1">
        <div className="home-hero">
          <motion.div
            className="home-icon"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
          >
            🕵️
          </motion.div>

          <motion.h1
            className="home-title"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className="text-accent">IMPOSTER</span>
          </motion.h1>

          <motion.p
            className="home-subtitle"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            One word. One liar. Find them.
          </motion.p>
        </div>

        <motion.div
          className="home-actions"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <button
            className="btn btn-primary btn-block btn-lg"
            onClick={() => setPhase(PHASES.SETUP)}
          >
            🎮 Play Pass & Play
          </button>
        </motion.div>

        <motion.p
          className="home-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          No accounts. Offline-first. Just lunch table chaos.
        </motion.p>
      </div>
    </motion.div>
  );
}
