import React, { useMemo } from "react";
import styles from "../styles/Starfield.module.css";

/**
 * Generates "xpx ypx #FFF, ..." for N stars within a 2000x2000 canvas.
 * We render two copies (one offset by +2000px) to create a seamless vertical loop.
 */
function makeBoxShadows(n) {
  const parts = [];
  for (let i = 0; i < n; i++) {
    const x = Math.floor(Math.random() * 2000);
    const y = Math.floor(Math.random() * 2000);
    parts.push(`${x}px ${y}px #FFF`);
  }
  return parts.join(", ");
}

export default function Starfield({
  smallCount = 700,
  mediumCount = 200,
  bigCount = 100,
  gradient = true, // set false if you want your app background instead
}) {
  const small = useMemo(() => makeBoxShadows(smallCount), [smallCount]);
  const medium = useMemo(() => makeBoxShadows(mediumCount), [mediumCount]);
  const big = useMemo(() => makeBoxShadows(bigCount), [bigCount]);

  return (
    <div
      className={`${styles.starfield} ${gradient ? styles.withGradient : ""}`}
      aria-hidden="true"
    >
      {/* layer 1 */}
      <div className={styles.layer} style={{ width: 1, height: 1, boxShadow: small, animationDuration: "50s" }} />
      <div className={`${styles.layer} ${styles.copy}`} style={{ width: 1, height: 1, boxShadow: small, animationDuration: "50s" }} />

      {/* layer 2 */}
      <div className={styles.layer} style={{ width: 2, height: 2, boxShadow: medium, animationDuration: "100s" }} />
      <div className={`${styles.layer} ${styles.copy}`} style={{ width: 2, height: 2, boxShadow: medium, animationDuration: "100s" }} />

      {/* layer 3 */}
      <div className={styles.layer} style={{ width: 3, height: 3, boxShadow: big, animationDuration: "150s" }} />
      <div className={`${styles.layer} ${styles.copy}`} style={{ width: 3, height: 3, boxShadow: big, animationDuration: "150s" }} />
    </div>
  );
}
