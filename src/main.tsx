import React from 'react'
import { createRoot } from "react-dom/client";
import "./index.scss";
import App from "./App.tsx";
import { GameProvider } from './context/GameContext'

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <GameProvider>
      <App />
    </GameProvider>
  </React.StrictMode>,
)
