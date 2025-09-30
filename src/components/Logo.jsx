import React, { useEffect, useMemo, useState } from "react";
import styles from "../styles/Logo.module.css";
import { useLocalStats } from "../hooks/useLocalStats.js";

const GRID_SIZES = [
  { label: "3x3", value: 9 },
  { label: "4x4", value: 16 },
  { label: "5x5", value: 25 },
];

export default function Logo({ onPlay, lastResult }) {
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
        className={`card left ${active === "L" ? "active" : ""}`}
        onClick={() => setActive((p) => (p === "L" ? null : "L"))}
        role="button"
        aria-label="Choose grid size"
      >
        <div className="flipper">
          <div className="f c2">{logoLetters[1]}</div>
          <div className="b contentbox levels">
            {GRID_SIZES.map((grid) => (
              <a
                key={grid.value}
                href="#"
                className="play"
                onClick={(e) => {
                  e.preventDefault();
                  onPlay(grid.value);
                }}
                data-level={grid.value}
              >
                {grid.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* I - Instructions */}
      <div
        className={`card left ${active === "I" ? "active" : ""}`}
        onClick={() => setActive((p) => (p === "I" ? null : "I"))}
        role="button"
        aria-label="Show instructions"
      >
        <div className="flipper">
          <div className="f c3">{logoLetters[2]}</div>
          <div className="b contentbox instructions">
            <div className="padded">
              <h2>Instructions</h2>
              <p>Press [p] to pause, or [ESC] to abandon game.</p>
              <p>Flip is a timed card memory game. Click the blue cards and try to find matching symbols.</p>
              <p>Uncover two matching symbols at once to eliminate them.</p>
              <p>Clear all cards before time runs out to win. Have fun FLIPing!</p>
            </div>
          </div>
        </div>
      </div>

      {/* P - Levels */}
      <div
        className={`card ${active === "P" ? "active" : ""}`}
        onClick={() => setActive((p) => (p === "P" ? null : "P"))}
        role="button"
        aria-label="Choose level"
      >
        <div className="flipper">
          <div className="f c4">{logoLetters[3]}</div>
          <div className="b contentbox instructions">
            <div className="padded">
              <h2>Welcome to Pepsi Electric Flip!</h2>
              <p>Choose your grid size from the L tile or click here to start with 4x4.</p>
              <a
                href="#play"
                className="playnow"
                onClick={(e) => {
                  e.preventDefault();
                  onPlay(16); // Default 4x4
                }}
              >
                Start 4x4 Game
              </a>
            </div>
          </div>
        </div>
      </div>

      <p className="info">
        Pepsi Electric Flip - Experience the electric energy of memory gaming!
      </p>
    </div>
  );
}
