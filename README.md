# 🕵️ IMPOSTER — Offline Pass & Play Party Game

A premium, high-fidelity social deduction word game built as a Progressive Web App (PWA) for phone viewports. Tailored for quick, high-energy rounds during office lunches or coffee breaks.

---

## 🎯 Game Concept & Mechanics

**Imposter** is a single-device offline facilitator:
1. **The Setup:** Add player names and configure rules. Select a category (e.g., *Bangalore Life*, *Indian Food*, *Office Life*, or type a *Custom Joke*).
2. **The Pass:** Pass the phone around. Each player holds down their finger to privately reveal their role and secret word.
   - **Civilians** see the target word.
   - **Imposters** see a decoy word (Classic mode) or `???` (Blind mode).
3. **The Play:** The app suggests a random starting player. Players verbally share one-word clues and debate physically.
4. **The Reveal:** Once voted out verbally, tap the Reveal button to show the truth!

---

## 📂 Features

- 📱 **Native Mobile Feel:** Styled with deep cyberpunk glassmorphism, responsive scales, and locks to `100dvh` viewports.
- 🌳 **Bangalore & India Themes:** Localized packs including hotspots (Indiranagar vs Koramangala), food, Bollywood, and tech life.
- 🔞 **18+ Spicy Mode:** Unlocks mature categories with a warning modal, shifting the app theme from electric purple to crimson red.
- 🃏 **Inside Jokes Creator:** Input your own custom Civilian and Imposter word pairs for personalized team rounds.
- 🔒 **Press-and-Hold Privacy:** Role card reveals only while pressing down, preventing adjacent peeking.
- 💾 **Local Storage Persistence:** Keeps player names saved on the device between rounds.

---

## 🛠️ Project Structure

```
app/
 ├── src/
 │    ├── context/
 │    │    └── GameContext.jsx   # Game reducer and state engine
 │    ├── data/
 │    │    └── wordPacks.js     # Categorized word pairs
 │    ├── screens/
 │    │    ├── HomeScreen       # Splash dashboard
 │    │    ├── SetupScreen      # Offline settings & player list
 │    │    ├── RevealScreen     # Hold-to-reveal private cards
 │    │    ├── PlayScreen       # Timer & speaking order list
 │    │    └── ResultsScreen    # Canvas confetti & role reveals
 │    ├── App.jsx               # Router & theme injector
 │    └── index.css             # Global dark-mode tokens
 └── index.html                 # Mobile-first meta viewports
```

---

## 🚀 Getting Started

To run the application locally:

```bash
# Navigate to the app directory
cd app

# Install dependencies
npm install

# Run Vite dev server
npm run dev
```

Open the local link (typically `http://localhost:5173/`) on your mobile browser or use developer tools mobile simulation.
