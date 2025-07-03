import { useEffect, useState, useRef } from "react";
import Styles from "./feeddisplay.module.css";

export default function FeedDisplay({ folderId, layout, customSettings }) {
  const { fontStyle, textAlign, border, borderColor } = customSettings;

  const feedStyle = {
    fontFamily: fontStyle,
    textAlign: textAlign,
    border: border ? `1px solid ${borderColor}` : "none",
    padding: "1rem",
    borderRadius: "8px",
  };

  const [feeds, setFeeds] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!folderId) return;

    fetch(`http://localhost/backend/getFeeds.php?folder_id=${folderId}`)
      .then((res) => res.json())
      .then((data) => setFeeds(data))
      .catch((err) => console.error("Failed to fetch feeds:", err));
  }, [folderId]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const isCardLayout = layout === "card1" || layout === "card2";

  return (
    <div className={Styles.container}>
      <div className={Styles.heading}>
        <h2>Feed Preview</h2>
      </div>

      <div className={isCardLayout ? Styles.cardWrapper : Styles}>
        {isCardLayout && (
          <>
            <button
              className={`${Styles.arrow} ${Styles.left}`}
              onClick={scrollLeft}
            >
              &#10094;
            </button>
            <button
              className={`${Styles.arrow} ${Styles.right}`}
              onClick={scrollRight}
            >
              &#10095;
            </button>
          </>
        )}

        <div
          ref={isCardLayout ? scrollRef : null}
          className={`${Styles.feeddata} ${Styles[layout]}`}
        >
          {feeds.map((feed) => (
            <div key={feed.id} className={Styles.feedItem} style={feedStyle}>
              {layout !== "list1" && (
                <img
                  src={`http://localhost:80/backend/${feed.image_url}`}
                  className={Styles.feedImage}
                  alt={feed.title}
                />
              )}
              <div className={Styles.feedText}>
                <h3>{feed.title}</h3>
                <p>{feed.description}</p>
                <small>{feed.date}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
