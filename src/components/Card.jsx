import React, { useMemo } from "react";

/**
 * Card renders one playing card (front = green, back = red with glyph).
 * 
 * Props:
 *  - glyphHex: string (example: "f010", "f021", …)
 */
export default function Card({ glyphHex }) {
  // Convert hex string like "f010" → actual Unicode character U+F010
  const char = useMemo(() => {
    if (!glyphHex) return "";
    const code = parseInt(glyphHex, 16);
    return String.fromCharCode(code);
  }, [glyphHex]);

  return (
    <div className="flipper">
      <div className="f" />
      {/* IMPORTANT: data-f holds the actual glyph character */}
      <div className="b" data-f={char} />
    </div>
  );
}
