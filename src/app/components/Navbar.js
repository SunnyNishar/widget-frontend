"use client";

import styles from "./navbar.module.css";
import { SlUser } from "react-icons/sl";

export default function Navbar() {
  return (
    <div className={styles.navbar}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Search Widget For Eg: Gardening, Baking, Yoga, etc"
      />
      <div className={styles.profileIcon}>
        <div className={styles.userCircle}>S</div>
        {/* You can add dropdown, logout, or profile link here later */}
      </div>
    </div>
  );
}
