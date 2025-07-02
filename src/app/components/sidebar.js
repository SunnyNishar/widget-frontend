import styles from '../page.module.css';

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <h2>Feedspot</h2>
      <ul>
        <li>Feedspot Home</li>
        <li>Widget Home</li>
        <li>My Widgets</li>
        <li>Widget Catalog</li>
        <li>Support</li>
        <li>Widget Examples</li>
        <li>Customers</li>
      </ul>
    </div>
  );
}
