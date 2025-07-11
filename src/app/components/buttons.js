"use client";
import styles from "./buttons.module.css";
import Image from "next/image";

import grid from "@/assets/menu.png";
import list from "@/assets/list.svg";
import matrix from "@/assets/matrix.svg";
import card from "@/assets/card.svg";

const viewOptions = [
  { key: "grid", icon: grid, alt: "Grid view" },
  { key: "list", icon: list, alt: "List view" },
  { key: "matrix", icon: matrix, alt: "Matrix view" },
  { key: "card", icon: card, alt: "Card view" },
];

export default function Buttons({ setView, currentView }) {
  return (
    <div className={styles.viewicons}>
      {viewOptions.map(({ key, icon, alt }) => (
        <button
          key={key}
          onClick={() => setView(key)}
          className={currentView === key ? styles.active : ""}
          title={`${key.charAt(0).toUpperCase() + key.slice(1)} View`}
        >
          <Image src={icon} width={16} height={16} alt={alt} />
        </button>
      ))}
    </div>
  );
}
