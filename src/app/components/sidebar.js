import styles from "./sidebar.module.css";
import Link from "next/link";

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <h2>Feedspot</h2>
      <ul>
        <li>Feedspot Home</li>
        <li>
          <Link href="/">Widget Home</Link>
        </li>
        <li>
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
