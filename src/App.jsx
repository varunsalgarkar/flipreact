import React, { useState, useCallback } from "react";
import Logo from "./components/Logo.jsx";
import GameBoard from "./components/GameBoard.jsx";

export default function App() {
  const [screen, setScreen] = useState("start"); // "start" | "playing" | "won" | "lost"
  const [level, setLevel] = useState(null);      // 8 | 18 | 32
  const [selectedGrid, setSelectedGrid] = useState(16); // Default 4x4
  const [winUrl, setWinUrl] = useState("");
  const [gameTime, setGameTime] = useState(60); // Default 60 seconds

  const handleStart = useCallback((chosenLevel) => {
    setLevel(chosenLevel);
    setScreen("playing");
  }, []);

  const handleEnd = useCallback((result) => {
    // result: "won" | "lost" | "abandoned"
    if (result === "abandoned") {
      setScreen("start");
      setLevel(null);
    } else if (result === "won" && winUrl) {
      // Redirect to win URL if provided (after popup delay)
      setTimeout(() => {
        window.open(winUrl, '_blank');
      }, 100); // Small delay to ensure popup has been removed
      setScreen(result);
      setLevel(null);
    } else {
      setScreen(result);
      setLevel(null);
    }
  }, [winUrl]);

  return (
    <div id="app">
      {screen === "start" && (
        <>
          <div className="game-title">
            <h1>Flip the Twin</h1>
            <h2>A CSR Initiative</h2>
          </div>
          <Logo 
            onPlay={handleStart} 
            lastResult={null}
            selectedGrid={selectedGrid}
            onGridSelect={setSelectedGrid}
            winUrl={winUrl}
            onWinUrlChange={setWinUrl}
            gameTime={gameTime}
            onGameTimeChange={setGameTime}
          />
        </>
      )}

      {screen === "playing" && level && (
        <GameBoard
          level={level}
          gameTime={gameTime}
          onEnd={handleEnd}
          onBackToMenu={() => setScreen("start")}
        />
      )}

      {screen === "won" && (
        <>
          <div className="game-title">
            <h1>Flip the Twin</h1>
            <h2>A CSR Initiative</h2>
          </div>
          <Logo 
            onPlay={handleStart} 
            lastResult="nice"
            selectedGrid={selectedGrid}
            onGridSelect={setSelectedGrid}
            winUrl={winUrl}
            onWinUrlChange={setWinUrl}
            gameTime={gameTime}
            onGameTimeChange={setGameTime}
          />
        </>
      )}
      {screen === "lost" && (
        <>
          <div className="game-title">
            <h1>Flip the Twin</h1>
            <h2>A CSR Initiative</h2>
          </div>
          <Logo 
            onPlay={handleStart} 
            lastResult="fail"
            selectedGrid={selectedGrid}
            onGridSelect={setSelectedGrid}
            winUrl={winUrl}
            onWinUrlChange={setWinUrl}
            gameTime={gameTime}
            onGameTimeChange={setGameTime}
          />
        </>
      )}
    </div>
  );
}
