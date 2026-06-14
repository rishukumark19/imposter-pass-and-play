import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame, PHASES } from "../context/GameContext";
import "./PlayScreen.css";

export default function PlayScreen() {
  const { state, dispatch } = useGame();
  const { players, starterPlayerId, settings } = state;

  const [timeLeft, setTimeLeft] = useState(settings.discussionTime);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const timerRef = useRef(null);
  const starterPlayer = players.find((p) => p.id === starterPlayerId) || players[0];

  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, timeLeft]);

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = (e) => {
    e.stopPropagation();
    setIsTimerRunning(false);
    setTimeLeft(settings.discussionTime);
  };

  const handleReveal = () => {
    dispatch({ type: "REVEAL_RESULTS" });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <motion.div
      className="screen play-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="glow-orb glow-orb-1" />
      <div className="glow-orb glow-orb-2" />

      <div className="screen-content z-1">
        <div className="play-header text-center">
          <span className="chip mb-auto">🗣️ Clue Round</span>
          <h2>Round in Progress</h2>
          <p>Pass the phone away and play physically</p>
        </div>

        {/* Starter Spotlight */}
        <div className="starter-spotlight card card-elevated text-center">
          <motion.div
            className="avatar avatar-lg"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            {starterPlayer.avatar}
          </motion.div>
          <h3>
            <span className="text-accent">{starterPlayer.name}</span> Starts!
          </h3>
          <p>Give your one-word clue first, then follow order below</p>
        </div>

        {/* Discussion Timer */}
        <div className="timer-container card" onClick={toggleTimer}>
          <div className="timer-circle">
            <span className={`timer-digits ${timeLeft < 10 && timeLeft > 0 ? "timer-danger" : ""}`}>
              {formatTime(timeLeft)}
            </span>
            <span className="timer-control-hint">
              {timeLeft === 0 ? "Time's Up!" : isTimerRunning ? "Tap to Pause" : "Tap to Start"}
            </span>
          </div>
          {timeLeft !== settings.discussionTime && (
            <button onClick={resetTimer} className="btn btn-secondary btn-sm timer-reset-btn">
              Reset
            </button>
          )}
        </div>

        {/* Reference speaking order */}
        <div className="speaking-order-box w-full">
          <h4>Speaking / Passing Order</h4>
          <div className="speaking-order-list">
            {players.map((p, index) => {
              const isStarter = p.id === starterPlayerId;
              return (
                <div key={p.id} className={`order-row ${isStarter ? "starter-active" : ""}`}>
                  <span className="order-number">{index + 1}</span>
                  <span className="avatar avatar-sm">{p.avatar}</span>
                  <span className="order-name">{p.name}</span>
                  {isStarter && <span className="starter-badge">First</span>}
                </div>
              );
            })}
          </div>
        </div>

        <button onClick={() => setShowConfirmModal(true)} className="btn btn-primary btn-block btn-lg">
          🔍 Reveal Imposter & Words
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="card modal-card text-center"
          >
            <span className="modal-icon">🔍</span>
            <h2>Reveal Results?</h2>
            <p>Has everyone finished giving clues, discussing, and voting?</p>
            <div className="modal-actions flex-col gap-sm">
              <button onClick={handleReveal} className="btn btn-danger btn-block">
                Yes, Show Imposter & Words
              </button>
              <button onClick={() => setShowConfirmModal(false)} className="btn btn-secondary btn-block">
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
