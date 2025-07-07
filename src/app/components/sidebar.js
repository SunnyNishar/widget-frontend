"use client";

import styles from "./sidebar.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <div className={styles.sidebar}>
      <h2>
        <a href="/">Feedspot</a>
      </h2>
      <ul>
        <li>Feedspot Home</li>
        <li className={pathname === "/" ? styles.active : ""}>
          <a href="/">Widget Home</a>
        </li>
        <li className={pathname === "/mywidgets" ? styles.active : ""}>
          <Link href="/mywidgets">My Widgets</Link>
        </li>
        <li>Widget Catalog</li>
        <li>Support</li>
        <li>Widget Examples</li>
        <li>Customers</li>
      </ul>
    </div>
  );
}
