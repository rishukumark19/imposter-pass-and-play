import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "../context/GameContext";
import "./RevealScreen.css";

export default function RevealScreen() {
  const { state, dispatch } = useGame();
  const { players, imposterIds, realWord, imposterWord, settings, revealIndex } = state;

  const [isReady, setIsReady] = useState(false);
  const [isHolding, setIsHolding] = useState(false);

  const currentPlayer = players[revealIndex];
  const isImposter = imposterIds.includes(currentPlayer?.id);

  const triggerHaptic = () => {
    if (navigator.vibrate) {
      navigator.vibrate(40);
    }
  };

  const handleStartHold = () => {
    triggerHaptic();
    setIsHolding(true);
  };

  const handleEndHold = () => {
    setIsHolding(false);
  };

  const handleNextPlayer = () => {
    setIsReady(false);
    setIsHolding(false);
    triggerHaptic();

    if (revealIndex < players.length - 1) {
      dispatch({ type: "NEXT_REVEAL" });
    } else {
      dispatch({ type: "END_REVEAL" });
    }
  };

  if (!currentPlayer) return null;

  return (
    <motion.div
      className="screen reveal-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
    >
      <div className="glow-orb glow-orb-1" />
      <div className="glow-orb glow-orb-2" />

      <div className="screen-content z-1">
        {/* Progress header */}
        <div className="reveal-progress">
          <div className="reveal-progress-bar">
            <motion.div
              className="reveal-progress-fill"
              initial={{ width: 0 }}
              animate={{
                width: `${((revealIndex + (isReady ? 0.5 : 0)) / players.length) * 100}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className="reveal-progress-text">
            {revealIndex + 1} / {players.length}
          </span>
        </div>

        {/* Pass prompt screen */}
        {!isReady ? (
          <div className="pass-prompt-container text-center">
            <div className="reveal-player-info">
              <motion.div
                className="avatar avatar-lg"
                key={currentPlayer.id}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 250, damping: 18 }}
              >
                {currentPlayer.avatar}
              </motion.div>
              <h2>Pass phone to <span className="text-accent">{currentPlayer.name}</span></h2>
              <p>Hand the device over and tap when ready</p>
            </div>
            <button
              onClick={() => {
                triggerHaptic();
                setIsReady(true);
              }}
              className="btn btn-primary btn-block btn-lg"
            >
              🤝 I am {currentPlayer.name}
            </button>
          </div>
        ) : (
          /* Hold to reveal screen */
          <div className="hold-container text-center">
            <h2>{currentPlayer.name}</h2>
            <p className="subtitle">Hold screen to reveal your secret word</p>

            <div className="reveal-card-container">
              <button
                className={`reveal-card card ${
                  isHolding
                    ? isImposter
                      ? "reveal-imposter"
                      : "reveal-civilian"
                    : "reveal-locked"
                }`}
                onMouseDown={handleStartHold}
                onMouseUp={handleEndHold}
                onMouseLeave={handleEndHold}
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleStartHold();
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  handleEndHold();
                }}
              >
                <AnimatePresence mode="wait">
                  {!isHolding ? (
                    <motion.div
                      key="locked"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="card-content-locked"
                    >
                      <span className="lock-icon">🔒</span>
                      <span className="hold-label">PRESS & HOLD</span>
                      <span className="shield-warning">Keep shielded from others</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="unlocked"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="card-content-unlocked"
                    >
                      <span className="role-label">
                        {isImposter ? "🕵️ IMPOSTER" : "✅ CIVILIAN"}
                      </span>

                      {isImposter && settings.difficulty === "blind" ? (
                        <div className="word-display">
                          <span className="word-label">Your word is:</span>
                          <span className="word-value text-danger">???</span>
                          <span className="word-subtext">You are blind! Blend in.</span>
                        </div>
                      ) : (
                        <div className="word-display">
                          <span className="word-label">Your word is:</span>
                          <span className="word-value">
                            {isImposter ? imposterWord : realWord}
                          </span>
                          <span className="word-subtext">
                            {isImposter ? "decoy word — do not expose it!" : "Civilian word"}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>

            <button
              onClick={handleNextPlayer}
              className="btn btn-secondary btn-block"
              disabled={isHolding}
            >
              {revealIndex < players.length - 1 ? "Next Player ➔" : "Round Setup Complete ✓"}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
