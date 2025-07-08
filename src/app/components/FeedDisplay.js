import { useEffect, useState, useRef } from "react";
import Styles from "./feeddisplay.module.css";

export default function FeedDisplay({
  folderId,
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

  const handleSave = async () => {
    const user_id = localStorage.getItem("user_id");

    if (!user_id) {
      alert("User not logged in. Please log in first.");
      return;
    }

    if (!folderId || !widgetName.trim()) {
      alert("Please select a folder and enter a widget name.");
      return;
    }

    if (editMode && !currentWidgetId) {
      alert("No widget ID provided for editing.");
      return;
    }

    const payload = {
      user_id: parseInt(user_id),
      folderId,
      widgetName: widgetName.trim(),
      fontStyle,
      textAlign,
      addBorder: border,
      borderColor,
      layout,
    };

    if (editMode) {
      payload.widgetId = currentWidgetId;
    }

    console.log("Saving widget with payload:", payload); // debug line

    try {
      const endpoint = editMode ? "updateWidget.php" : "saveWidget.php";
      const response = await fetch(`http://localhost/backend/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

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
        if (editMode) {
          window.location.href = "/mywidgets";
        }
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
          <button className={Styles.button} onClick={handleSave}>
            {editMode ? "Update Widget" : "Save & Get Code"}
          </button>
          <button className={Styles.button2} onClick={handleReset}>
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
                <h3>
                  <a href={feed.url} target="_blank" rel="noopener noreferrer">
                    {feed.title}
                  </a>
                </h3>
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
