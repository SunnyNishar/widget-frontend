import { useEffect, useState, useRef } from "react";
import Styles from "./feeddisplay.module.css";
import { IoIosSend } from "react-icons/io";

export default function FeedDisplay({
  folderId,
  feedUrl,
  layout,
  customSettings,
  setCustomSettings,
  widgetName,
  setWidgetName,
  editMode = false,
  currentWidgetId = null,
}) {
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

  const defaultSettings = {
    fontStyle: "Arial",
    textAlign: "left",
    border: false,
    borderColor: "#000000",
  };

  useEffect(() => {
    if (!folderId && !feedUrl) return;

    let url = "";
    if (feedUrl) {
      url = `${
        process.env.NEXT_PUBLIC_API_BASE_URL
      }/getFeedsFromUrl.php?url=${encodeURIComponent(feedUrl)}`;
    } else {
      url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/getFeeds.php?folder_id=${folderId}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => setFeeds(data))
      .catch((err) => console.error("Failed to fetch feeds:", err));
  }, [folderId, feedUrl]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      // Calculate the exact width of one card plus gap
      const cardWidth = 280; // min-width of card
      const gap = 16; // 1rem gap
      const scrollAmount = cardWidth + gap;

      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      // Calculate the exact width of one card plus gap
      const cardWidth = 280; // min-width of card
      const gap = 16; // 1rem gap
      const scrollAmount = cardWidth + gap;

      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const isCardLayout = layout === "card1" || layout === "card2";

  const handleSave = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("User not logged in. Please log in first.");
      return;
    }

    if ((!folderId && !feedUrl) || !widgetName.trim()) {
      alert(
        "Please enter a widget name and either select a folder or provide an RSS URL."
      );
      return;
    }

    if (editMode && !currentWidgetId) {
      alert("No widget ID provided for editing.");
      return;
    }

    const payload = {
      widgetName: widgetName.trim(),
      fontStyle,
      textAlign,
      addBorder: border,
      borderColor,
      layout,
      folderId: folderId || null,
      rssUrl: feedUrl || null,
    };

    if (editMode) {
      payload.widgetId = currentWidgetId;
    }

    console.log("Saving widget with payload:", payload); // debug line

    try {
      const endpoint = editMode ? "updateWidget.php" : "saveWidget.php";
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Response is not JSON:", text);
        throw new Error("Server returned non-JSON response");
      }

      const result = await response.json();

      if (result.success) {
        alert(
          editMode
            ? "Widget updated successfully!"
            : "Widget saved successfully!"
        );
        window.location.href = "/mywidgets";
      } else {
        alert(editMode ? "Failed to update widget." : "Failed to save widget.");
        console.error("Error from server:", result.error);
      }
    } catch (error) {
      console.error("Save failed:", error);
      alert(`An error occurred while saving: ${error.message}`);
    }
  };

  const handleReset = () => {
    setCustomSettings(defaultSettings);
    setWidgetName("");
  };

  return (
    <div className={Styles.container}>
      <div className={Styles.heading}>
        <h2>Feed Preview {editMode && "(Edit Mode)"}</h2>
      </div>
      <div className={Styles.row}>
        <div className={Styles.widgetentry}>
          <input
            type="text"
            placeholder="Enter Widget Name"
            value={widgetName}
            required
            onChange={(e) => setWidgetName(e.target.value)}
          />
        </div>
        <div className={Styles.buttons}>
          <button
            className={Styles.button}
            onClick={handleSave}
            title={editMode ? "Update Widget" : "Save & Get Code"}
          >
            {editMode ? "Update Widget" : "Save & Get Code"}
            <IoIosSend />
          </button>
          <button
            className={Styles.button2}
            onClick={handleReset}
            title="Reset Settings"
          >
            Reset
          </button>
        </div>
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
          {Array.isArray(feeds) &&
            feeds.map((feed, index) => (
              <div
                key={`feed-${index}`}
                className={Styles.feedItem}
                style={feedStyle}
              >
                {layout !== "list1" && (
                  <img
                    src={
                      feed.image?.startsWith("http")
                        ? feed.image
                        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/${feed.image_url}`
                    }
                    className={Styles.feedImage}
                    // alt={feed.title}
                  />
                )}
                <div className={Styles.feedText}>
                  <h4>
                    <a
                      href={feed.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {feed.title}
                    </a>
                  </h4>
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
