import { AnimatePresence } from "framer-motion";
import { GameProvider, useGame, PHASES } from "./context/GameContext";
import HomeScreen from "./screens/HomeScreen";
import SetupScreen from "./screens/SetupScreen";
import RevealScreen from "./screens/RevealScreen";
import PlayScreen from "./screens/PlayScreen";
import ResultsScreen from "./screens/ResultsScreen";

function GameRouter() {
  const { state } = useGame();
  const { phase, settings } = state;

  // Set theme to 'spicy' if category tier is spicy (18+)
  const isSpicyMode = settings.category === "desi_spicy" || settings.category === "romance" || settings.category === "chaos";
  const theme = isSpicyMode ? "spicy" : undefined;

  return (
    <div data-theme={theme} className="w-full h-full">
      <AnimatePresence mode="wait">
        {phase === PHASES.HOME && <HomeScreen key="home" />}
        {phase === PHASES.SETUP && <SetupScreen key="setup" />}
        {phase === PHASES.REVEAL && <RevealScreen key="reveal" />}
        {phase === PHASES.PLAY && <PlayScreen key="play" />}
        {phase === PHASES.RESULTS && <ResultsScreen key="results" />}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  );
}
