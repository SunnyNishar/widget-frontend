'use client';
import { useState } from 'react';
import styles from './feedcheck.module.css';

export default function FeedCheck() {
  const [folder, setFolder] = useState('');
  const [feeds, setFeeds] = useState([]);
  const [textColor, setTextColor] = useState('#000000');

  const handleChange = async (e) => {
    const selected = e.target.value;
    setFolder(selected);
    if (selected) {
      const res = await fetch(`/feeds/${selected}.json`);
      const data = await res.json();
      setFeeds(data);
    } else {
      setFeeds([]);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <label>Select Folder:</label>
        <select value={folder} onChange={handleChange}>
          <option value="">-- Choose --</option>
          <option value="homepage">Homepage</option>
          <option value="sports">Sports</option>
        </select>

        <label>Text Color:</label>
        <input
          type="color"
          value={textColor}
          onChange={(e) => setTextColor(e.target.value)}
        />
      </div>

      <div className={styles.feedArea} style={{ color: textColor }}>
        <h2>Feed Preview</h2>
        {feeds.length === 0 ? (
          <p>No items to display</p>
        ) : (
          feeds.map((item, idx) => (
            <div className={styles.feedItem} key={idx}>
              {item.image && (
                <img src={item.image} alt="Feed" className={styles.image} />
              )}
              <a href={item.link} target="_blank" rel="noreferrer" className={styles.title}>
                {item.title}
              </a>
              <p className={styles.description}>{item.description}</p>
              <p className={styles.meta}>By {item.author} – {item.date}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
