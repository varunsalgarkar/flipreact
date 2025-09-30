import React from "react";
import styles from "../styles/Card.module.css";

/**
 * The symbol is rendered via CSS ::before content using data-f attribute
 * to keep the original “GeneralFoundicons” style.
 */
export default function Card({ symbolCode }) {
  return (
    <div className="flipper">
      <div className="f" />
      <div className="b" data-f={`\b${symbolCode}`} />
    </div>
  );
}
