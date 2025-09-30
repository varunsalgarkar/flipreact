import React, { useState, useCallback } from "react";
import Logo from "./components/Logo.jsx";
import GameBoard from "./components/GameBoard.jsx";

export default function App() {
  const [screen, setScreen] = useState("start"); // "start" | "playing" | "won" | "lost"
  const [level, setLevel] = useState(null);      // 8 | 18 | 32

  const handleStart = useCallback((chosenLevel) => {
    setLevel(chosenLevel);
    setScreen("playing");
  }, []);

  const handleEnd = useCallback((result) => {
    // result: "won" | "lost" | "abandoned"
    if (result === "abandoned") {
      setScreen("start");
      setLevel(null);
    } else {
      setScreen(result);
      setLevel(null);
    }
  }, []);

  return (
    <div id="app">
      {screen === "start" && (
        <Logo onPlay={handleStart} lastResult={null} />
      )}

      {screen === "playing" && level && (
        <GameBoard
          level={level}
          onEnd={handleEnd}
          onBackToMenu={() => setScreen("start")}
        />
      )}

      {screen === "won" && (
        <Logo onPlay={handleStart} lastResult="nice" />
      )}
      {screen === "lost" && (
        <Logo onPlay={handleStart} lastResult="fail" />
      )}
    </div>
  );
}
