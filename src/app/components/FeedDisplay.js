import { useEffect, useState } from "react";
import Styles from "./feeddisplay.module.css";

export default function FeedDisplay({ folderId }) {
  const [feeds, setFeeds] = useState([]);

  useEffect(() => {
    if (!folderId) return;

    fetch(`http://localhost/backend/getFeeds.php?folder_id=${folderId}`)
      .then((res) => res.json())
      .then((data) => setFeeds(data))
      .catch((err) => console.error("Failed to fetch feeds:", err));
  }, [folderId]);

  return (
    <div className={Styles.container}>
      <div className={Styles.heading}>
        <h2>Feed Preview</h2>
      </div>
      <div className={Styles.feeddata}>
        {feeds.map((feed) => (
          <div key={feed.id} className={Styles.feedItem}>
            <div className={Styles.feedText}>
              <img
                src={`http://localhost:80/backend/${feed.image_url}`}
                className={Styles.feedImage}
              />
              <h3>{feed.title}</h3>
              <p>{feed.description}</p>
              <small>{feed.date}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
