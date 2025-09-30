import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Card from "./Card.jsx";
import gbStyles from "../styles/GameBoard.module.css";
import { shuffle } from "../utils/shuffle.js";
import { useLocalStats } from "../hooks/useLocalStats.js";

const DIFFICULTY = {
  8:  { key: "casual", mult: 4 },
  18: { key: "medium", mult: 5 },
  32: { key: "hard",   mult: 6 },
};

export default function GameBoard({ level, onEnd, onBackToMenu }) {
  const { recordAbandoned, bumpFlip, recordBestTime } = useLocalStats();
  const [paused, setPaused] = useState(false);
  const [cards, setCards] = useState([]);
  const [active, setActive] = useState([]); // indices of currently flipped (not yet matched)
  const [found, setFound] = useState(new Set());
  const [lost, setLost] = useState(false);

  const startTs = useRef(performance.now());
  const timerMs = useMemo(() => 1000 * level * DIFFICULTY[level].mult, [level]);
  const difficultyKey = DIFFICULTY[level].key;

  // Build symbols: mirror the original (00.., with special-case mapping for 30→10 and 31→21)
  const symbols = useMemo(() => {
    const base = Array.from({ length: level }, (_, i) => {
      let code = i;
      if (code < 10) return `0${code}`;
      if (code === 30) return "10";
      if (code === 31) return "21";
      return `${code}`;
    });
    return shuffle([...base, ...base]);
  }, [level]);

  // Initialize cards once
  useEffect(() => {
    recordAbandoned(+1); // game starts → count as abandoned until conclusion
    setCards(
      symbols.map((code) => ({
        code, // string used by CSS ::before via data-f
      }))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbols]);

  // Keyboard handlers: pause [P] and abandon [ESC]
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "p" || e.key === "P") {
        setPaused((p) => !p);
      } else if (e.key === "Escape") {
        // Abandon
        setPaused(false);
        recordAbandoned(-1); // remove “abandoned” since user left to menu
        onEnd("abandoned");
      }
    };
    window.addEventListener("keyup", onKey);
    return () => window.removeEventListener("keyup", onKey);
  }, [onEnd, recordAbandoned]);

  // Timer-end → lost
  useEffect(() => {
    if (paused) return;
    // Rely on CSS animation for the visual bar; JS timeout to trigger fail
    const id = setTimeout(() => {
      setLost(true);
      recordAbandoned(-1); // not abandoned anymore—game concluded
      onEnd("lost");
    }, timerMs);
    return () => clearTimeout(id);
  }, [paused, timerMs, onEnd, recordAbandoned]);

  // Win detection
  useEffect(() => {
    if (found.size && found.size === cards.length) {
      const elapsed = performance.now() - startTs.current;
      recordBestTime(difficultyKey, elapsed);
      recordAbandoned(-1); // conclude
      onEnd("won");
    }
  }, [found, cards.length, difficultyKey, recordBestTime, onEnd, recordAbandoned]);

  const handleCardClick = useCallback(
    (idx) => {
      if (paused || found.has(idx) || active.includes(idx)) return;

      const nextActive = [...active, idx];
      setActive(nextActive);

      // When two are active, evaluate after 401ms (match original delay)
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
    <div id="g" className={gbStyles[difficultyKey]} data-paused={paused ? 1 : 0}>
      {/* Timer bar with CSS animation (paused via inline style) */}
      <i
        className="timer"
        style={{
          animation: `timer ${timerMs}ms linear`,
          animationPlayState: paused ? "paused" : "running",
        }}
      />

      {/* Pause overlay */}
      {paused && <div className="pause" />}

      {/* Grid of cards */}
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
            <Card symbolCode={c.code} />
          </div>
        );
      })}

      {/* Simple top-left “Back” affordance (optional) */}
      <button className={gbStyles.backBtn} onClick={() => {
        setPaused(false);
        onBackToMenu();
      }}>
        ⟵ Menu (ESC to abandon)
      </button>
    </div>
  );
}
