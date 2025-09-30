import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Card from "./Card.jsx";
import gbStyles from "../styles/GameBoard.module.css";
import { shuffle } from "../utils/shuffle.js";
import { useLocalStats } from "../hooks/useLocalStats.js";

const GRID_CONFIG = {
  16: { key: "4x4", mult: 4 },
  36: { key: "6x6", mult: 6 },
  64: { key: "8x8", mult: 8 },
};

export default function GameBoard({ level, gameTime, onEnd, onBackToMenu }) {
  const { recordAbandoned, bumpFlip, recordBestTime } = useLocalStats();
  const [paused, setPaused] = useState(false);
  const [cards, setCards] = useState([]);
  const [active, setActive] = useState([]);
  const [found, setFound] = useState(new Set());
  const [lost, setLost] = useState(false);

  const startTs = useRef(performance.now());
  const timerMs = useMemo(() => gameTime * 1000, [gameTime]);
  const gridKey = GRID_CONFIG[level].key;

  // Build symbols for the grid
  const symbols = useMemo(() => {
    const pairsNeeded = level / 2;
    const hasOddCard = level % 2 === 1;

    const base = Array.from({ length: Math.floor(pairsNeeded) }, (_, i) => {
      let hex = i.toString(16).padStart(2, "0"); // "00".."1f"
      if (hex === "1e") hex = "10"; // map 30 → f010
      if (hex === "1f") hex = "21"; // map 31 → f021
      return `f0${hex}`;
    });

    let allCards = [...base, ...base]; // pairs

    if (hasOddCard) {
      let extra = base.length.toString(16).padStart(2, "0");
      allCards.push(`f0${extra}`);
    }

    return shuffle(allCards);
  }, [level]);

  // Initialize cards once
  useEffect(() => {
    recordAbandoned(+1); // mark game started
    setCards(symbols.map((code) => ({ code })));
  }, [symbols, recordAbandoned]);

  // Keyboard handlers
  useEffect(() => {
    const onKey = (e) => {
      if (e.key.toLowerCase() === "p") {
        setPaused((p) => !p);
      } else if (e.key === "Escape") {
        setPaused(false);
        recordAbandoned(-1);
        onEnd("abandoned");
      }
    };
    window.addEventListener("keyup", onKey);
    return () => window.removeEventListener("keyup", onKey);
  }, [onEnd, recordAbandoned]);

  // Timer
  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => {
      setLost(true);
      recordAbandoned(-1);
      onEnd("lost");
    }, timerMs);
    return () => clearTimeout(id);
  }, [paused, timerMs, onEnd, recordAbandoned]);

  // Win detection
  useEffect(() => {
    if (found.size && found.size === cards.length) {
      const elapsed = performance.now() - startTs.current;
      recordBestTime(gridKey, elapsed);
      recordAbandoned(-1);

      // Show popup then finish
      const popup = document.createElement("div");
      popup.className = "congratulations-popup";
      popup.innerHTML = `
        <div class="popup-content">
          <h2>Congratulations!</h2>
          <img src="https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3cmNhcDE3ZGxwN3MwZml0ZnVmamtyYW00eDNrZjh4cXBoeDFydGk5MyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/BfOlhCJfYBQxW/giphy.gif" alt="Celebration" />
        </div>
      `;
      document.body.appendChild(popup);

      setTimeout(() => {
        document.body.removeChild(popup);
        onEnd("won");
      }, 5000);
    }
  }, [found, cards.length, gridKey, recordBestTime, onEnd, recordAbandoned]);

  const handleCardClick = useCallback(
    (idx) => {
      if (paused || found.has(idx) || active.includes(idx)) return;

      const nextActive = [...active, idx];
      setActive(nextActive);

      if (nextActive.length === 2) {
        const [a, b] = nextActive;
        const isMatch = cards[a].code === cards[b].code;

        setTimeout(() => {
          if (isMatch) {
            bumpFlip("matched");
            setFound((prev) => new Set([...prev, a, b]));
            setActive([]);
          } else {
            bumpFlip("wrong");
            setActive([]);
          }
        }, 401);
      }
    },
    [active, cards, paused, found, bumpFlip]
  );

  const gridSide = Math.sqrt(cards.length) || 1;
  const cellPct = 100 / gridSide;

  return (
    <div id="g" className={gbStyles[gridKey]} data-paused={paused ? 1 : 0}>
      <i
        className="timer"
        style={{
          animation: `timer ${timerMs}ms linear`,
          animationPlayState: paused ? "paused" : "running",
        }}
      />

      {paused && <div className="pause" />}

      {cards.map((c, i) => {
        const isFlipped = active.includes(i) || found.has(i);
        return (
          <div
            key={i}
            className={`card ${isFlipped ? "active" : ""} ${found.has(i) ? "found" : ""}`}
            style={{ width: `${cellPct}%`, height: `${cellPct}%` }}
            onMouseDown={() => handleCardClick(i)}
            role="button"
            aria-label="flip card"
          >
            {/* ✅ Use the glyph hex string */}
            <Card glyphHex={c.code} />
          </div>
        );
      })}

      <button
        className={gbStyles.backBtn}
        onClick={() => {
          setPaused(false);
          onBackToMenu();
        }}
      >
        ⟵ Menu (ESC to abandon)
      </button>
    </div>
  );
}
