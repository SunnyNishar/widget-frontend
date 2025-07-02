'use client';
import styles from './buttons.module.css';
import Image from 'next/image';
import grid from "@/assets/menu.png";
import list from "@/assets/list.svg";
import matrix from "@/assets/matrix.svg";
import card from "@/assets/card.svg";

export default function Buttons({ setView, currentView }) {
  return (
    <div className={styles.viewicons}>
      <button
        onClick={() => setView('grid')}
        className={currentView === 'grid' ? styles.active : ''}
      >
        <Image src={grid} width={16} height={16} alt="Grid view" />
      </button>
      <button
        onClick={() => setView('list')}
        className={currentView === 'list' ? styles.active : ''}
      >
        <Image src={list} width={16} height={16} alt="List view" />
      </button>
      <button
        onClick={() => setView('matrix')}
        className={currentView === 'matrix' ? styles.active : ''}
      >
        <Image src={matrix} width={16} height={16} alt="Matrix view" />
      </button>
      <button
        onClick={() => setView('card')}
        className={currentView === 'card' ? styles.active : ''}
      >
        <Image src={card} width={16} height={16} alt="Card view" />
      </button>
    </div>
  );
}
