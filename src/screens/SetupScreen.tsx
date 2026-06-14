import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame, PHASES } from "../context/GameContext";

const CATEGORIES = [
  // Safe
  { id: "bangalore", name: "🌳 Namma Bengaluru", tier: "safe", desc: "Metro delays & tech bro tears" },
  { id: "indian_food", name: "🍛 Food Coma", tier: "safe", desc: "Biryani vs Pulao debates" },
  { id: "office", name: "💼 9 to 5 Grind", tier: "safe", desc: "Appraisals & 'pls fix' PRs" },
  { id: "tech", name: "💻 Tech Bros", tier: "safe", desc: "Frameworks & production bugs" },
  { id: "food", name: "🍕 Munchies", tier: "safe", desc: "Snacks that ruin your diet" },
  { id: "movies", name: "🎬 Binge Watch", tier: "safe", desc: "Spoilers for everything" },
  { id: "bollywood", name: "🎭 Desi Drama", tier: "safe", desc: "Iconic dialogues & overacting" },
  // Spicy
  { id: "desi_spicy", name: "🌶️ Desi Nights", tier: "spicy", desc: "Pub crawls & questionable texts" },
  { id: "romance", name: "🔥 Getting Steamy", tier: "spicy", desc: "Flirting & terrible pickup lines" },
  { id: "chaos", name: "💀 Pure Chaos", tier: "spicy", desc: "Unhinged internet culture" },
  // Custom
  { id: "custom", name: "🃏 DIY Roast", tier: "safe", desc: "Bring your own inside jokes" },
];

export default function SetupScreen() {
  const { state, dispatch } = useGame();
  const { players, settings } = state;

  const [newName, setNewName] = useState("");
  const [showAdultModal, setShowAdultModal] = useState(false);
  const [pendingCategory, setPendingCategory] = useState<string | null>(null);

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    dispatch({ type: "ADD_PLAYER", name: newName.trim() });
    setNewName("");
  };

  const handleRemovePlayer = (id: string) => {
    dispatch({ type: "REMOVE_PLAYER", id });
  };

  const movePlayer = (index: number, direction: number) => {
    const updated = [...players];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= players.length) return;
    [updated[index], updated[targetIndex]] = [updated[targetIndex], updated[index]];
    dispatch({ type: "REORDER_PLAYERS", players: updated });
  };

  const handleSelectCategory = (cat: any) => {
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
      settings: { contentMode: "spicy", category: pendingCategory! },
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
      alert("Spit it out! You need both words for DIY Roast.");
      return;
    }
    dispatch({ type: "START_ROUND" });
  };

  return (
    <div className="w-full max-w-md mx-auto h-screen flex flex-col p-6 overflow-y-auto pb-24 scroll-smooth">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
          Who's Playing?
        </h1>
        <p className="text-white/60 font-medium">Gather the squad.</p>
      </div>

      {/* Players Section */}
      <div className="mb-10">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span>👥</span> Squad ({players.length})
        </h3>
        
        <form onSubmit={handleAddPlayer} className="flex gap-2 mb-4">
          <input
            type="text"
            className="input-field flex-1"
            placeholder="Name drop here..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            maxLength={12}
          />
          <button type="submit" className="btn-primary w-auto px-6 whitespace-nowrap">
            ＋ Add
          </button>
        </form>

        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence initial={false}>
            {players.map((p, idx) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass rounded-xl p-3 flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl shadow-inner">
                    {p.avatar}
                  </div>
                  <span className="font-bold text-lg">{p.name}</span>
                </div>
                
                <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button onClick={() => movePlayer(idx, -1)} disabled={idx === 0} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/20 disabled:opacity-30 flex items-center justify-center transition-colors">
                    ▲
                  </button>
                  <button onClick={() => movePlayer(idx, 1)} disabled={idx === players.length - 1} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/20 disabled:opacity-30 flex items-center justify-center transition-colors">
                    ▼
                  </button>
                  <button onClick={() => handleRemovePlayer(p.id)} className="w-8 h-8 rounded-lg bg-accent/20 text-accent hover:bg-accent hover:text-white flex items-center justify-center transition-colors ml-1">
                    ✕
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {players.length < 3 && (
          <p className="text-accent text-sm font-semibold mt-3 text-center animate-pulse">
            Need at least 3 players to start the drama.
          </p>
        )}
      </div>

      {/* Categories Section */}
      <div className="mb-10">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span>📂</span> Choose Your Vibe
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {CATEGORIES.map((cat) => {
            const isSelected = settings.category === cat.id;
            const isSpicy = cat.tier === "spicy";
            return (
              <div
                key={cat.id}
                onClick={() => handleSelectCategory(cat)}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border ${
                  isSelected 
                    ? isSpicy ? 'bg-accent/20 border-accent shadow-[0_0_15px_rgba(244,63,94,0.3)] scale-[1.02]' : 'bg-primary/20 border-primary shadow-[0_0_15px_rgba(109,40,217,0.3)] scale-[1.02]'
                    : 'glass border-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-bold text-lg">{cat.name}</h4>
                  {isSpicy && <span className="bg-accent text-white text-xs font-black px-2 py-1 rounded-md shadow-lg">🔥 18+</span>}
                </div>
                <p className="text-sm text-white/60">{cat.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Word Inputs */}
      {settings.category === "custom" && (
        <div className="mb-10">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>💬</span> DIY Roast
          </h3>
          <div className="glass-card p-5">
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Civilian Word (The Truth)</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g., Working Hard"
                  value={settings.customCivilianWord}
                  onChange={(e) => dispatch({ type: "UPDATE_SETTINGS", settings: { customCivilianWord: e.target.value } })}
                  maxLength={24}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-accent/80 uppercase tracking-wider mb-2">Imposter Word (The Lie)</label>
                <input
                  type="text"
                  className="input-field border-accent/30 focus:border-accent focus:ring-accent"
                  placeholder="e.g., Hardly Working"
                  value={settings.customImposterWord}
                  onChange={(e) => dispatch({ type: "UPDATE_SETTINGS", settings: { customImposterWord: e.target.value } })}
                  maxLength={24}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rules Section */}
      <div className="mb-10">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span>⚙️</span> The Rules
        </h3>
        <div className="glass-card divide-y divide-white/10">
          
          <div className="p-4 flex items-center justify-between">
            <div>
              <h4 className="font-bold">Imposters</h4>
              <p className="text-xs text-white/50">How many liars?</p>
            </div>
            <div className="flex bg-black/40 rounded-lg p-1">
              {[1, 2].map((num) => (
                <button
                  key={num}
                  className={`px-4 py-2 rounded-md font-bold text-sm transition-all ${
                    settings.imposterCount === num ? "bg-white/20 text-white shadow-md" : "text-white/40 hover:text-white/80"
                  }`}
                  onClick={() => dispatch({ type: "UPDATE_SETTINGS", settings: { imposterCount: num } })}
                  disabled={players.length < 5 && num === 2}
                  type="button"
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div className="pr-4">
              <h4 className="font-bold">Difficulty</h4>
              <p className="text-xs text-white/50 leading-tight">
                {settings.difficulty === "classic" ? "Classic: Imposters see a decoy word." : "Blind: Imposters see absolutely nothing (???)."}
              </p>
            </div>
            <div className="flex bg-black/40 rounded-lg p-1 shrink-0">
              <button
                className={`px-3 py-2 rounded-md font-bold text-xs transition-all ${
                  settings.difficulty === "classic" ? "bg-white/20 text-white shadow-md" : "text-white/40 hover:text-white/80"
                }`}
                onClick={() => dispatch({ type: "UPDATE_SETTINGS", settings: { difficulty: "classic" } })}
              >
                Classic
              </button>
              <button
                className={`px-3 py-2 rounded-md font-bold text-xs transition-all ${
                  settings.difficulty === "blind" ? "bg-accent/80 text-white shadow-md" : "text-white/40 hover:text-white/80"
                }`}
                onClick={() => dispatch({ type: "UPDATE_SETTINGS", settings: { difficulty: "blind" } })}
              >
                Blind
              </button>
            </div>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div className="pr-4">
              <h4 className="font-bold text-accent">Paranoia Mode</h4>
              <p className="text-xs text-white/50 leading-tight">20% chance NO ONE is the imposter.</p>
            </div>
            <button
              className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${settings.trickRound ? 'bg-accent' : 'bg-white/10'}`}
              onClick={() => dispatch({ type: "UPDATE_SETTINGS", settings: { trickRound: !settings.trickRound } })}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${settings.trickRound ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-gradient-to-t from-dark via-dark to-transparent pb-6 z-20 flex flex-col gap-3 max-w-md left-1/2 -translate-x-1/2">
        <button
          onClick={handleStartGame}
          className="btn-primary text-lg tracking-wide shadow-[0_0_30px_rgba(109,40,217,0.4)]"
          disabled={players.length < 3}
        >
          🚀 Start Passing
        </button>
        <button
          onClick={() => dispatch({ type: "SET_PHASE", phase: PHASES.HOME })}
          className="text-white/50 text-sm font-semibold hover:text-white transition-colors py-2"
        >
          ⬅ Back to Home
        </button>
      </div>

      {/* 18+ Warning Modal */}
      {showAdultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="glass-card max-w-sm w-full p-6 text-center border-accent/30"
          >
            <div className="text-6xl mb-4 animate-bounce">🔞</div>
            <h2 className="text-2xl font-black mb-2 text-accent">NSFW Warning</h2>
            <p className="text-white/70 text-sm mb-6 leading-relaxed">
              This category contains 18+ adult themes, dating situations, and spicy double meanings. 
              Are you sure your HR department isn't watching?
            </p>
            <div className="flex flex-col gap-3">
              <button onClick={confirmAdultMode} className="w-full bg-accent text-white font-bold py-3 rounded-xl shadow-[0_0_15px_rgba(244,63,94,0.4)] hover:bg-accent/90 transition-all">
                Yes, Unlock Spicy Mode 🔥
              </button>
              <button onClick={() => setShowAdultModal(false)} className="btn-secondary">
                Nope, Take Me Back
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
