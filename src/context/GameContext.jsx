import { createContext, useContext, useReducer, useCallback, useEffect } from "react";
import wordPacks from "../data/wordPacks.js";

const GameContext = createContext(null);

const AVATARS = [
  "🦊", "🐼", "🦁", "🐸", "🦄", "🐙", "🦋", "🐺",
  "🦅", "🐯", "🐻", "🦎", "🐬", "🦉", "🐢", "🦈",
];

// ── Game Phases ──
export const PHASES = {
  HOME: "home",
  SETUP: "setup",
  REVEAL: "reveal",
  PLAY: "play",
  RESULTS: "results",
};

// Default players if localStorage is empty
const DEFAULT_PLAYERS = [
  { id: "p_1", name: "Rahul", avatar: "🦊" },
  { id: "p_2", name: "Priya", avatar: "🐼" },
  { id: "p_3", name: "Amit", avatar: "🦁" },
  { id: "p_4", name: "Kiran", avatar: "🐸" },
];

// ── Initial State ──
const initialState = {
  phase: PHASES.HOME,
  players: [],
  settings: {
    contentMode: "safe",       // safe | spicy (locks 18+ items)
    difficulty: "classic",      // classic | blind
    category: "bangalore",      // selected category key
    imposterCount: 1,
    trickRound: false,         // trick round (no imposter)
    discussionTime: 90,
    customCivilianWord: "",
    customImposterWord: "",
  },
  currentRound: 0,
  realWord: "",
  imposterWord: "",
  imposterIds: [],
  starterPlayerId: null,
  revealIndex: 0,
};

// ── Pick a word pair ──
function pickWordPair(contentMode, category) {
  // Find category in spicy or safe
  let pool = null;
  if (wordPacks.safe[category]) {
    pool = wordPacks.safe[category].words;
  } else if (wordPacks.casual[category]) {
    pool = wordPacks.casual[category].words;
  } else if (wordPacks.spicy[category]) {
    pool = wordPacks.spicy[category].words;
  } else if (wordPacks.unhinged[category]) {
    pool = wordPacks.unhinged[category].words;
  }

  // Fallback if not found
  if (!pool || pool.length === 0) {
    pool = wordPacks.safe.bangalore.words;
  }

  const pair = pool[Math.floor(Math.random() * pool.length)];
  return pair || ["Filter Coffee", "Starbucks Latte"];
}

// ── Shuffle ──
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Reducer ──
function gameReducer(state, action) {
  switch (action.type) {
    case "SET_PHASE":
      return { ...state, phase: action.phase };

    case "LOAD_PLAYERS":
      return { ...state, players: action.players };

    case "ADD_PLAYER": {
      const id = "p_" + Date.now();
      const usedAvatars = state.players.map((p) => p.avatar);
      const avatar = AVATARS.find((a) => !usedAvatars.includes(a)) || AVATARS[Math.floor(Math.random() * AVATARS.length)];
      const updatedPlayers = [...state.players, { id, name: action.name, avatar }];
      localStorage.setItem("imposter_players", JSON.stringify(updatedPlayers));
      return { ...state, players: updatedPlayers };
    }

    case "REMOVE_PLAYER": {
      const updatedPlayers = state.players.filter((p) => p.id !== action.id);
      localStorage.setItem("imposter_players", JSON.stringify(updatedPlayers));
      return { ...state, players: updatedPlayers };
    }

    case "REORDER_PLAYERS": {
      localStorage.setItem("imposter_players", JSON.stringify(action.players));
      return { ...state, players: action.players };
    }

    case "UPDATE_SETTINGS":
      return {
        ...state,
        settings: { ...state.settings, ...action.settings },
      };

    case "START_ROUND": {
      const { settings, players, currentRound } = state;
      
      let realWord, imposterWord;
      if (settings.category === "custom") {
        realWord = settings.customCivilianWord || "Filter Coffee";
        imposterWord = settings.customImposterWord || "Starbucks Latte";
      } else {
        [realWord, imposterWord] = pickWordPair(settings.contentMode, settings.category);
      }

      // Determine Imposters
      let imposterIds = [];
      if (!settings.trickRound) {
        const shuffled = shuffle(players);
        const count = Math.min(settings.imposterCount, players.length - 1);
        imposterIds = shuffled.slice(0, count).map((p) => p.id);
      }

      // Select a random Civilian to start (or any player if trick round)
      const civilians = players.filter((p) => !imposterIds.includes(p.id));
      const starterList = civilians.length > 0 ? civilians : players;
      const starterPlayerId = starterList[Math.floor(Math.random() * starterList.length)].id;

      return {
        ...state,
        phase: PHASES.REVEAL,
        currentRound: currentRound + 1,
        realWord,
        imposterWord: settings.difficulty === "blind" ? "" : imposterWord,
        imposterIds,
        starterPlayerId,
        revealIndex: 0,
      };
    }

    case "NEXT_REVEAL":
      return { ...state, revealIndex: state.revealIndex + 1 };

    case "END_REVEAL":
      return { ...state, phase: PHASES.PLAY };

    case "REVEAL_RESULTS":
      return { ...state, phase: PHASES.RESULTS };

    case "PLAY_AGAIN":
      return { ...state, phase: PHASES.SETUP };

    case "RESET_GAME":
      return { ...state, phase: PHASES.HOME };

    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Load players from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("imposter_players");
    if (saved) {
      try {
        dispatch({ type: "LOAD_PLAYERS", players: JSON.parse(saved) });
      } catch (e) {
        dispatch({ type: "LOAD_PLAYERS", players: DEFAULT_PLAYERS });
      }
    } else {
      localStorage.setItem("imposter_players", JSON.stringify(DEFAULT_PLAYERS));
      dispatch({ type: "LOAD_PLAYERS", players: DEFAULT_PLAYERS });
    }
  }, []);

  const setPhase = useCallback((phase) => dispatch({ type: "SET_PHASE", phase }), []);

  return (
    <GameContext.Provider value={{ state, dispatch, setPhase }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
