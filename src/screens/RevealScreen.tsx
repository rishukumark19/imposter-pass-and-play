import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "../context/GameContext";

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
      className="w-full max-w-md mx-auto h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
    >
      {/* Background glow specific to Reveal */}
      <div className="absolute top-[-20%] right-[-20%] w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-[-20%] left-[-20%] w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />

      <div className="z-10 w-full flex flex-col h-full py-8">
        
        {/* Progress header */}
        <div className="w-full flex items-center justify-between mb-12 px-2">
          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden mr-4">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-secondary"
              initial={{ width: 0 }}
              animate={{
                width: `${((revealIndex + (isReady ? 0.5 : 0)) / players.length) * 100}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className="text-white/50 font-bold text-sm whitespace-nowrap">
            {revealIndex + 1} / {players.length}
          </span>
        </div>

        {/* Dynamic content area */}
        <div className="flex-1 flex flex-col items-center justify-center w-full">
          {!isReady ? (
            /* Pass prompt screen */
            <div className="flex flex-col items-center text-center w-full max-w-xs mx-auto gap-8">
              <motion.div
                className="w-32 h-32 rounded-full glass border-2 border-white/20 flex items-center justify-center text-6xl shadow-[0_0_40px_rgba(255,255,255,0.1)]"
                key={currentPlayer.id}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 250, damping: 18 }}
              >
                {currentPlayer.avatar}
              </motion.div>
              
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl text-white/80 font-medium">
                  Pass phone to <br />
                  <span className="text-4xl font-black text-white">{currentPlayer.name}</span>
                </h2>
                <p className="text-white/50 text-sm">Don't let anyone else peek.</p>
              </div>

              <button
                onClick={() => {
                  triggerHaptic();
                  setIsReady(true);
                }}
                className="btn-primary mt-4"
              >
                🤝 Yeah, that's me
              </button>
            </div>
          ) : (
            /* Hold to reveal screen */
            <div className="flex flex-col items-center text-center w-full gap-8">
              <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-black text-white">{currentPlayer.name}</h2>
                <p className="text-accent/80 text-sm font-bold uppercase tracking-widest">Top Secret</p>
              </div>

              <div className="w-full relative h-[320px]">
                <button
                  className={`w-full h-full rounded-3xl border-2 transition-all duration-300 relative overflow-hidden group select-none shadow-2xl ${
                    isHolding
                      ? isImposter
                        ? "bg-accent/10 border-accent shadow-[0_0_50px_rgba(244,63,94,0.3)]"
                        : "bg-primary/10 border-primary shadow-[0_0_50px_rgba(109,40,217,0.3)]"
                      : "bg-black/60 border-white/20 hover:border-white/40"
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
                        className="absolute inset-0 flex flex-col items-center justify-center p-6 gap-4"
                      >
                        <div className="text-6xl text-white/40 group-hover:text-white/60 transition-colors group-active:scale-90 duration-300">
                          👆
                        </div>
                        <span className="text-xl font-black text-white/60 tracking-widest uppercase">Hold to Peek</span>
                        <span className="text-xs text-white/30 uppercase font-bold tracking-widest">Keep it shielded</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="unlocked"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex flex-col items-center justify-center p-8 backdrop-blur-md"
                      >
                        <span className={`text-sm font-black tracking-widest uppercase px-3 py-1 rounded-full mb-6 ${
                          isImposter ? "bg-accent text-white" : "bg-primary text-white"
                        }`}>
                          {isImposter ? "🕵️ IMPOSTER" : "✅ CIVILIAN"}
                        </span>

                        {isImposter && settings.difficulty === "blind" ? (
                          <div className="flex flex-col items-center gap-2">
                            <span className="text-white/60 text-sm font-semibold uppercase tracking-wider">Your word is:</span>
                            <span className="text-5xl font-black text-accent drop-shadow-lg">???</span>
                            <span className="text-accent/80 text-sm font-bold mt-4">You are completely blind! Blend in.</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <span className="text-white/60 text-sm font-semibold uppercase tracking-wider">Your word is:</span>
                            <span className={`text-4xl md:text-5xl font-black text-white drop-shadow-lg text-center ${
                               isImposter ? 'text-accent' : ''
                            }`}>
                              {isImposter ? imposterWord : realWord}
                            </span>
                            <span className="text-white/50 text-sm font-medium mt-4 text-center px-4">
                              {isImposter ? "This is a decoy word! Do not expose it." : "Memorize it. Don't let them see."}
                            </span>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>

              <div className="w-full mt-auto pt-4">
                <button
                  onClick={handleNextPlayer}
                  className="btn-secondary"
                  disabled={isHolding}
                >
                  {revealIndex < players.length - 1 ? "Next Player ➔" : "Start the Round ✓"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
