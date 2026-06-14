import React, { createContext, useContext, useReducer, useCallback, useEffect } from "react";
import type { ReactNode } from "react";
import wordPacks from "../data/wordPacks";

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
} as const;

export type Phase = typeof PHASES[keyof typeof PHASES];

export interface Player {
  id: string;
  name: string;
  avatar: string;
}

export interface GameSettings {
  contentMode: "safe" | "casual" | "spicy" | "unhinged";
  difficulty: "classic" | "blind";
  category: string;
  imposterCount: number;
  trickRound: boolean;
  discussionTime: number;
  customCivilianWord: string;
  customImposterWord: string;
}

export interface GameState {
  phase: Phase;
  players: Player[];
  settings: GameSettings;
  currentRound: number;
  realWord: string;
  imposterWord: string;
  imposterIds: string[];
  starterPlayerId: string | null;
  revealIndex: number;
}

const DEFAULT_PLAYERS: Player[] = [
  { id: "p_1", name: "Rahul", avatar: "🦊" },
  { id: "p_2", name: "Priya", avatar: "🐼" },
  { id: "p_3", name: "Amit", avatar: "🦁" },
  { id: "p_4", name: "Kiran", avatar: "🐸" },
];

const initialState: GameState = {
  phase: PHASES.HOME,
  players: [],
  settings: {
    contentMode: "safe",
    difficulty: "classic",
    category: "bangalore",
    imposterCount: 1,
    trickRound: false,
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

type Action =
  | { type: "SET_PHASE"; phase: Phase }
  | { type: "LOAD_PLAYERS"; players: Player[] }
  | { type: "ADD_PLAYER"; name: string }
  | { type: "REMOVE_PLAYER"; id: string }
  | { type: "REORDER_PLAYERS"; players: Player[] }
  | { type: "UPDATE_SETTINGS"; settings: Partial<GameSettings> }
  | { type: "START_ROUND" }
  | { type: "NEXT_REVEAL" }
  | { type: "END_REVEAL" }
  | { type: "REVEAL_RESULTS" }
  | { type: "PLAY_AGAIN" }
  | { type: "RESET_GAME" };

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<Action>;
  setPhase: (phase: Phase) => void;
}

const GameContext = createContext<GameContextType | null>(null);

function pickWordPair(category: string): [string, string] {
  let pool: [string, string][] | null = null;
  const packs = wordPacks as any;
  if (packs.safe[category]) {
    pool = packs.safe[category].words;
  } else if (packs.casual[category]) {
    pool = packs.casual[category].words;
  } else if (packs.spicy[category]) {
    pool = packs.spicy[category].words;
  } else if (packs.unhinged[category]) {
    pool = packs.unhinged[category].words;
  }

  if (!pool || pool.length === 0) {
    pool = packs.safe.bangalore.words;
  }

  const pair = pool![Math.floor(Math.random() * pool!.length)];
  return pair || ["Filter Coffee", "Starbucks Latte"];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function gameReducer(state: GameState, action: Action): GameState {
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
        [realWord, imposterWord] = pickWordPair(settings.category);
      }

      let imposterIds: string[] = [];
      if (!settings.trickRound) {
        const shuffled = shuffle(players);
        const count = Math.min(settings.imposterCount, players.length - 1);
        imposterIds = shuffled.slice(0, count).map((p) => p.id);
      }

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

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

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

  const setPhase = useCallback((phase: Phase) => dispatch({ type: "SET_PHASE", phase }), []);

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
