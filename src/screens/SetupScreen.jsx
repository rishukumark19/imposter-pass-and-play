import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame, PHASES } from "../context/GameContext";
import "./SetupScreen.css";

const CATEGORIES = [
  // Safe
  { id: "bangalore", name: "🌳 Bangalore Life", tier: "safe", desc: "Local hotspots, metro, and auto jokes" },
  { id: "indian_food", name: "🍛 Indian Food", tier: "safe", desc: "Biryani, samosa, Dosa, and street food" },
  { id: "office", name: "💼 Office Life", tier: "safe", desc: "Appraisals, manager feedback, WFH, and Slack" },
  { id: "tech", name: "💻 Tech Life", tier: "safe", desc: "Frameworks, databases, deployment, and bugs" },
  { id: "food", name: "🍕 General Food", tier: "safe", desc: "Universal snacks, fast food, and beverages" },
  { id: "movies", name: "🎬 Movies & Shows", tier: "safe", desc: "Bollywood hits, OTT binges, and global classics" },
  { id: "bollywood", name: "🎭 Bollywood", tier: "safe", desc: "Stars, hit songs, iconic dialogs" },
  // Spicy
  { id: "desi_spicy", name: "🌶️ 18+ Desi / Bangalore", tier: "spicy", desc: "Local dating, PG drama, Oyo, and pub crawls" },
  { id: "romance", name: "🔥 Spicy Romance", tier: "spicy", desc: "Seduction, double meanings, and spicy encounters" },
  { id: "chaos", name: "💀 Unhinged Chaos", tier: "spicy", desc: "Wild internet culture, adult slang, and pure chaos" },
  // Custom
  { id: "custom", name: "🃏 Custom Jokes", tier: "safe", desc: "Type in your own civilian and imposter words" },
];

export default function SetupScreen() {
  const { state, dispatch } = useGame();
  const { players, settings } = state;

  const [newName, setNewName] = useState("");
  const [showAdultModal, setShowAdultModal] = useState(false);
  const [pendingCategory, setPendingCategory] = useState(null);

  const handleAddPlayer = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    dispatch({ type: "ADD_PLAYER", name: newName.trim() });
    setNewName("");
  };

  const handleRemovePlayer = (id) => {
    dispatch({ type: "REMOVE_PLAYER", id });
  };

  const movePlayer = (index, direction) => {
    const updated = [...players];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= players.length) return;
    // Swap
    [updated[index], updated[targetIndex]] = [updated[targetIndex], updated[index]];
    dispatch({ type: "REORDER_PLAYERS", players: updated });
  };

  const handleSelectCategory = (cat) => {
    if (cat.tier === "spicy" && settings.contentMode !== "spicy") {
      setPendingCategory(cat.id);
      setShowAdultModal(true);
    } else {
      dispatch({ type: "UPDATE_SETTINGS", settings: { category: cat.id } });
    }
  };

  const confirmAdultMode = () => {
    dispatch({
      type: "UPDATE_SETTINGS",
      settings: { contentMode: "spicy", category: pendingCategory },
    });
    setShowAdultModal(false);
    setPendingCategory(null);
  };

  const handleStartGame = () => {
    if (players.length < 3) return;
    if (
      settings.category === "custom" &&
      (!settings.customCivilianWord.trim() || !settings.customImposterWord.trim())
    ) {
      alert("Please fill in both Civilian and Imposter words for custom play!");
      return;
    }
    dispatch({ type: "START_ROUND" });
  };

  return (
    <div className="screen setup-screen scrollable">
      <div className="setup-header">
        <h1 className="text-accent">Game Setup</h1>
        <p>Prepare the office lunch circle</p>
      </div>

      <div className="setup-section">
        <h3>👥 Players ({players.length})</h3>
        <form onSubmit={handleAddPlayer} className="add-player-form">
          <input
            type="text"
            className="input"
            placeholder="Add player name..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            maxLength={12}
          />
          <button type="submit" className="btn btn-primary btn-sm">
            ＋ Add
          </button>
        </form>

        <div className="players-list-scroll">
          <AnimatePresence initial={false}>
            {players.map((p, idx) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="player-setup-item"
              >
                <span className="avatar avatar-sm">{p.avatar}</span>
                <span className="player-setup-name">{p.name}</span>
                <div className="player-setup-controls">
                  <button
                    onClick={() => movePlayer(idx, -1)}
                    disabled={idx === 0}
                    className="order-btn"
                    type="button"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => movePlayer(idx, 1)}
                    disabled={idx === players.length - 1}
                    className="order-btn"
                    type="button"
                  >
                    ▼
                  </button>
                  <button
                    onClick={() => handleRemovePlayer(p.id)}
                    className="remove-btn"
                    type="button"
                  >
                    ✕
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {players.length < 3 && (
          <p className="warning-text">Need at least 3 players to start.</p>
        )}
      </div>

      <div className="setup-section">
        <h3>📂 Category Pack</h3>
        <div className="categories-grid">
          {CATEGORIES.map((cat) => {
            const isSelected = settings.category === cat.id;
            const isSpicy = cat.tier === "spicy";
            return (
              <div
                key={cat.id}
                onClick={() => handleSelectCategory(cat)}
                className={`category-card ${isSelected ? "selected" : ""} ${
                  isSpicy ? "spicy-card" : ""
                }`}
              >
                <div className="category-card-header">
                  <h4>{cat.name}</h4>
                  {isSpicy && <span className="flame-badge">🔥 18+</span>}
                </div>
                <p>{cat.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {settings.category === "custom" && (
        <div className="setup-section">
          <h3>💬 Custom Word Setup</h3>
          <div className="card card-elevated rules-card">
            <div className="flex-col gap-sm">
              <label className="input-label" style={{ fontSize: "0.85rem", fontWeight: "600" }}>Civilian Word</label>
              <input
                type="text"
                className="input"
                placeholder="e.g., Koramangala"
                value={settings.customCivilianWord}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_SETTINGS",
                    settings: { customCivilianWord: e.target.value },
                  })
                }
                maxLength={24}
              />
              <label className="input-label" style={{ fontSize: "0.85rem", fontWeight: "600", marginTop: "8px" }}>Imposter Word</label>
              <input
                type="text"
                className="input"
                placeholder="e.g., Indiranagar"
                value={settings.customImposterWord}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_SETTINGS",
                    settings: { customImposterWord: e.target.value },
                  })
                }
                maxLength={24}
              />
            </div>
          </div>
        </div>
      )}

      <div className="setup-section">
        <h3>⚙️ Game Rules</h3>
        <div className="card card-elevated rules-card">
          <div className="rule-row">
            <div className="rule-info">
              <h4>Imposter Count</h4>
              <p>How many fakers in the group</p>
            </div>
            <div className="segment-control">
              {[1, 2].map((num) => (
                <button
                  key={num}
                  className={`segment-btn ${settings.imposterCount === num ? "active" : ""}`}
                  onClick={() =>
                    dispatch({ type: "UPDATE_SETTINGS", settings: { imposterCount: num } })
                  }
                  disabled={players.length < 5 && num === 2}
                  type="button"
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div className="rule-row">
            <div className="rule-info">
              <h4>Difficulty</h4>
              <p>
                {settings.difficulty === "classic"
                  ? "Classic: Imposter gets decoy word hint"
                  : "Blind: Imposter gets no word hint (???)"}
              </p>
            </div>
            <div className="segment-control">
              <button
                className={`segment-btn ${settings.difficulty === "classic" ? "active" : ""}`}
                onClick={() =>
                  dispatch({ type: "UPDATE_SETTINGS", settings: { difficulty: "classic" } })
                }
                type="button"
              >
                Classic
              </button>
              <button
                className={`segment-btn ${settings.difficulty === "blind" ? "active" : ""}`}
                onClick={() =>
                  dispatch({ type: "UPDATE_SETTINGS", settings: { difficulty: "blind" } })
                }
                type="button"
              >
                Blind
              </button>
            </div>
          </div>

          <div className="rule-row">
            <div className="rule-info">
              <h4>Trick Round</h4>
              <p>Paranoia: 20% chance everyone gets the same word</p>
            </div>
            <div
              className={`toggle-track ${settings.trickRound ? "active" : ""}`}
              onClick={() =>
                dispatch({
                  type: "UPDATE_SETTINGS",
                  settings: { trickRound: !settings.trickRound },
                })
              }
            >
              <div className="toggle-thumb" />
            </div>
          </div>
        </div>
      </div>

      <div className="setup-actions">
        <button
          onClick={handleStartGame}
          className="btn btn-primary btn-block btn-lg"
          disabled={players.length < 3}
        >
          🚀 Start Pass & Play
        </button>
        <button
          onClick={() => dispatch({ type: "SET_PHASE", phase: PHASES.HOME })}
          className="btn btn-secondary btn-block"
        >
          ⬅ Back Home
        </button>
      </div>

      {/* 18+ Warning Modal */}
      {showAdultModal && (
        <div className="modal-overlay">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="card modal-card text-center"
          >
            <span className="modal-icon">🔞</span>
            <h2>Adult Content Warning</h2>
            <p>
              This category contains 18+ adult themes, dating situations, and spicy double
              meanings suitable for adult groups. Do you want to unlock spicy mode?
            </p>
            <div className="modal-actions flex-col gap-sm">
              <button onClick={confirmAdultMode} className="btn btn-danger btn-block">
                Yes, Unlock Spicy Mode 🔥
              </button>
              <button onClick={() => setShowAdultModal(false)} className="btn btn-secondary btn-block">
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
