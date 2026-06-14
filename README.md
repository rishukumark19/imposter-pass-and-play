# 🕵️ IMPOSTER — Final Master Game Design Document (v2)
> Synthesized from: GPT 2 · Claude 2 · Gemini 2 · Perplexity 2 · Antigravity  
> **This is the single source of truth for the offline, pass-and-play party game.**

---

## 🎯 Product Vision & Core Principle

**Imposter** is a high-fidelity, offline-first party helper game built as an installable Progressive Web App (PWA) for phones. It is designed to be played around a single office lunch table by passing around **one single phone**.

### The Core Principle:
> **The app is not the game master — the humans are.**
> The app does not track scores, manage clue typing, or record in-app votes. It is purely a **secret word distributor + starter facilitator + final round reveal helper**. All social deduction, debates, accusations, and voting happen verbally in real life. This keeps the phone interactions fast, private, and seamless.

---

## 👥 Player Roles & Difficulty Settings

| Role | What They See | Their Goal |
|---|---|---|
| **Civilian** | The real word (e.g., `Indiranagar`) | Describe it with a one-word clue. Don't be too obvious! |
| **Imposter** | Decoy word (e.g., `Koramangala`) OR nothing (`???`) | Guess the real word from clues, blend in, and survive. |

### Difficulty Toggles:
- **Classic (Easy):** Imposter receives a closely related decoy word (e.g., Civilian = `Biryani`, Imposter = `Pulao`).
- **Blind / Mr. X (Hard):** Imposter receives no clue at all (displays `???`). They must listen closely to the first players' clues to adapt.
- **Brutal:** Imposter receives a word from a completely different category, making blending in a supreme improvisational challenge.

### Gameplay Variations:
- **Double Imposter Mode:** Enforces 2 Imposters (automatically enabled or toggled for groups of 7+ players).
- **Trick Round (No Imposter):** A paranoia-inducing setting where everyone gets the exact same civilian word, but players don't know if there is an imposter in the group.

---

## 🛠️ Stack & Architecture

- **Framework:** React + TypeScript + Vite
- **Styling:** Tailwind CSS v4 + SCSS for global glassmorphism and keyframe animations
- **State:** Context API (`GameContext.tsx`)
- **Animations:** Framer Motion

To run the project locally:
```bash
npm install
npm run dev
```
