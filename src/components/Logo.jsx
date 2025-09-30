import React, { useEffect, useMemo, useState } from "react";
import styles from "../styles/Logo.module.css";
import { useLocalStats } from "../hooks/useLocalStats.js";

const GRID_SIZES = [
  { label: "3x3", value: 9 },
  { label: "4x4", value: 16 },
  { label: "5x5", value: 25 },
];

export default function Logo({ onPlay, lastResult, selectedGrid, onGridSelect, winUrl, onWinUrlChange, gameTime, onGameTimeChange }) {
  const [active, setActive] = useState(null); // "F" | "L" | "I" | "P" | null
  const { stats, initIfEmpty, bumpGameTotals, toTime } = useLocalStats();

  // Mirror original behavior: when coming back with "nice"/"fail"
  useEffect(() => {
    initIfEmpty();
    if (lastResult === "nice") bumpGameTotals("won");
    if (lastResult === "fail") bumpGameTotals("lost");
  }, [lastResult]);

  const logoLetters = useMemo(() => ["F", "L", "I", "P"], []);

  return (
    <div className="logo">
      <p className="info">Click the P to get started.</p>

      {/* F - Figures / Stats */}
      <div
        className={`card left ${active === "F" ? "active" : ""}`}
        onClick={() => setActive((p) => (p === "F" ? null : "F"))}
        role="button"
        aria-label="Show stats"
      >
        <div className="flipper">
          <div className="f c1">{logoLetters[0]}</div>
          <div className="b contentbox" id="stats">
            <div className="padded">
              <h2>
                Figures
                <span>
                  <b>{stats.flip_won}</b>
                  <i>Won</i>
                  <b>{stats.flip_lost}</b>
                  <i>Lost</i>
                  <b>{stats.flip_abandoned}</b>
                  <i>Abandoned</i>
                </span>
              </h2>

              <ul>
                <li><b>Best 3x3:</b> <span>{toTime(stats.flip_3x3)}</span></li>
                <li><b>Best 4x4:</b> <span>{toTime(stats.flip_4x4)}</span></li>
                <li><b>Best 5x5:</b> <span>{toTime(stats.flip_5x5)}</span></li>
              </ul>

              <ul>
                <li><b>Total Flips:</b> <span>{(stats.flip_matched + stats.flip_wrong) * 2}</span></li>
                <li><b>Matched Flips:</b> <span>{stats.flip_matched}</span></li>
                <li><b>Wrong Flips:</b> <span>{stats.flip_wrong}</span></li>
              </ul>

              <a
                href="#play"
                className="playnow"
                onClick={(e) => {
                  e.preventDefault();
                  setActive("P");
                }}
              >
                Play now
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* L - Grid Levels */}
      <div
        className={`card ${active === "L" ? "active" : ""}`}
        onClick={() => setActive((p) => (p === "L" ? null : "L"))}
        role="button"
        aria-label="Choose grid size"
      >
        <div className="flipper">
          <div className="f c2">{logoLetters[1]}</div>
          <div className="b contentbox levels">
            <div className="padded">
              <h2>Grid Size</h2>
              {GRID_SIZES.map((grid) => (
                <a
                  key={grid.value}
                  href="#"
                  className={`play ${selectedGrid === grid.value ? 'selected' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onGridSelect(grid.value);
                  }}
                  data-level={grid.value}
                >
                  {grid.label}
                </a>
              ))}
              <p className="info">Selected: {GRID_SIZES.find(g => g.value === selectedGrid)?.label || "None"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* I - Settings */}
      <div
        className={`card left ${active === "I" ? "active" : ""}`}
        onClick={(e) => {
          // Only toggle if clicking outside form elements
          if (e.target === e.currentTarget || e.target.closest('.flipper') === e.currentTarget.querySelector('.flipper')) {
            setActive((p) => (p === "I" ? null : "I"));
          }
        }}
        role="button"
        aria-label="Game settings"
      >
        <div className="flipper">
          <div className="f c3">{logoLetters[2]}</div>
          <div 
            className="b contentbox instructions"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="padded">
              <h2>Settings</h2>
              
              <div className="setting-group">
                <label htmlFor="win-url">Win URL:</label>
                <input
                  id="win-url"
                  type="url"
                  value={winUrl}
                  onChange={(e) => onWinUrlChange(e.target.value)}
                  placeholder="https://example.com"
                  className="setting-input"
                  onClick={(e) => e.stopPropagation()}
                />
                <p className="setting-desc">URL to redirect to when you win</p>
              </div>

              <div className="setting-group">
                <label htmlFor="game-time">Game Time (seconds):</label>
                <input
                  id="game-time"
                  type="number"
                  min="10"
                  max="300"
                  value={gameTime}
                  onChange={(e) => onGameTimeChange(parseInt(e.target.value) || 60)}
                  className="setting-input"
                  onClick={(e) => e.stopPropagation()}
                />
                <p className="setting-desc">Time limit for the game</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* P - Play */}
      <div
        className={`card ${active === "P" ? "active" : ""}`}
        onClick={() => setActive((p) => (p === "P" ? null : "P"))}
        role="button"
        aria-label="Start game"
      >
        <div className="flipper">
          <div className="f c4">{logoLetters[3]}</div>
          <div className="b contentbox levels">
            <div className="padded">
              <h2>Play Game</h2>
              {selectedGrid ? (
                <>
                  <p>Grid: {GRID_SIZES.find(g => g.value === selectedGrid)?.label}</p>
                  <p>Time: {gameTime}s</p>
                  <a
                    href="#play"
                    className="playnow"
                    onClick={(e) => {
                      e.preventDefault();
                      onPlay(selectedGrid);
                    }}
                  >
                    Start Game
                  </a>
                </>
              ) : (
                <p>Please select a grid size from the L tile first.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <p className="info">
        Flip should work best in Google Chrome, decent in Firefox, IE10 and Opera;
      </p>
    </div>
  );
}