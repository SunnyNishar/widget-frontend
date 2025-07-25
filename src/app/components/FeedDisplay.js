"use client";
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
  embedMode = false,
}) {
  const {
    fontStyle,
    textAlign,
    border,
    borderColor,
    widthType,
    widthPixels,
    heightType,
    heightPixels,
    heightPosts,
    autoScroll,
    useCustomTitle,
    mainTitle,
    titleFontSize,
    titleBold,
    titleFontColor,
    titleBgColor,
    useCustomContent,
    showFeedTitle,
    showFeedDescription,
    showFeedDate,
    feedTitleBold,
    feedDescriptionBold,
    feedTitleFontColor,
    feedTitleFontSize,
    backgroundColor,
  } = customSettings;

  const [feeds, setFeeds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);
  const autoScrollIntervalRef = useRef(null);
  const [feedItemHeight, setFeedItemHeight] = useState(120); // Default fallback
  const feedItemRef = useRef(null);
  const measurementDoneRef = useRef(false);
  const titleRef = useRef(null);

  const measureFeedItemHeight = () => {
    if (
      feedItemRef.current &&
      feeds.length > 0 &&
      !measurementDoneRef.current
    ) {
      const firstFeedItem = feedItemRef.current;
      const itemHeight = firstFeedItem.offsetHeight;
      const itemMarginTop =
        parseInt(window.getComputedStyle(firstFeedItem).marginTop) || 0;
      const itemMarginBottom =
        parseInt(window.getComputedStyle(firstFeedItem).marginBottom) || 0;

      const totalItemHeight = itemHeight + itemMarginTop + itemMarginBottom;

      console.log("Measured feed item height:", totalItemHeight);
      setFeedItemHeight(totalItemHeight);
      measurementDoneRef.current = true;
    }
  };

  useEffect(() => {
    if (feeds.length > 0) {
      measurementDoneRef.current = false;
      setTimeout(measureFeedItemHeight, 100);
    }
  }, [feeds, layout]);

  const getFeedDataHeight = () => {
    if (heightType === "pixels") {
      return `${heightPixels}px`;
    } else if (heightType === "posts") {
      const calculatedHeight = heightPosts * feedItemHeight;
      return `${calculatedHeight}px`;
    }
    return "auto";
  };

  // Height update useEffect (only for edit mode)
  useEffect(() => {
    if (
      editMode &&
      currentWidgetId &&
      feeds.length > 0 &&
      feedItemHeight > 0 &&
      measurementDoneRef.current &&
      process.env.NEXT_PUBLIC_API_BASE_URL
    ) {
      const feedContentHeight =
        heightType === "posts" ? heightPosts * feedItemHeight : heightPixels;

      const titleHeight = titleRef.current?.offsetHeight || 0;
      const borderThickness = border ? 4 : 0;

      const calculatedHeight = Math.ceil(
        feedContentHeight + titleHeight + borderThickness
      );

      const widgetIdNum = parseInt(currentWidgetId);
      if (isNaN(widgetIdNum) || widgetIdNum <= 0) {
        console.warn("Invalid widget ID for height update:", currentWidgetId);
        return;
      }

      const timeoutId = setTimeout(() => {
        fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/updateWidgetHeight.php`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              widgetId: widgetIdNum,
              actualHeight: calculatedHeight,
            }),
          }
        )
          .then((res) => {
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
          })
          .then((data) => {
            if (!data.success) {
              console.warn("Height update skipped:", data.error);
            } else {
              console.log("Widget height updated successfully");
            }
          })
          .catch((err) => {
            console.warn("Height update failed:", err.message);
          });
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [
    editMode,
    currentWidgetId,
    feeds.length,
    feedItemHeight,
    heightType,
    heightPosts,
    heightPixels,
    border,
    measurementDoneRef.current,
  ]);

  // Auto-scroll functionality (FIXED)
  const startAutoScroll = () => {
    if (!autoScroll || !scrollRef.current || !measurementDoneRef.current)
      return;

    console.log("Starting autoscroll with feedItemHeight:", feedItemHeight);

    autoScrollIntervalRef.current = setInterval(() => {
      if (!scrollRef.current) return;

      const container = scrollRef.current;
      const isCardLayout = layout === "card1" || layout === "card2";

      if (isCardLayout) {
        // For card layouts, scroll horizontally
        const cardWidth = 280;
        const gap = 16;
        const scrollAmount = cardWidth + gap;
        const maxScroll = container.scrollWidth - container.clientWidth;

        if (container.scrollLeft >= maxScroll - 10) {
          // Small buffer
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          container.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
      } else {
        // For other layouts, scroll vertically using measured height
        const scrollAmount = feedItemHeight;
        const maxScroll = container.scrollHeight - container.clientHeight;

        console.log("Scroll info:", {
          currentScrollTop: container.scrollTop,
          scrollAmount,
          maxScroll,
          containerHeight: container.clientHeight,
          scrollHeight: container.scrollHeight,
        });

        const isNearBottom = container.scrollTop >= maxScroll - 10; // Small buffer

        if (isNearBottom) {
          container.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          container.scrollBy({ top: scrollAmount, behavior: "smooth" });
        }
      }
    }, 3000); // Scroll every 3 seconds
  };

  const stopAutoScroll = () => {
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
      autoScrollIntervalRef.current = null;
    }
  };

  useEffect(() => {
    stopAutoScroll();
    if (
      autoScroll &&
      feeds.length > 0 &&
      measurementDoneRef.current &&
      feedItemHeight > 0
    ) {
      // Add a small delay to ensure DOM is fully rendered
      const timeoutId = setTimeout(() => {
        startAutoScroll();
      }, 1000); // 1 second delay

      return () => {
        clearTimeout(timeoutId);
        stopAutoScroll();
      };
    }

    return () => stopAutoScroll();
  }, [
    autoScroll,
    feeds.length,
    layout,
    feedItemHeight,
    measurementDoneRef.current,
  ]);

  // Fetch feeds
  useEffect(() => {
    if (!folderId && !feedUrl) {
      setFeeds([]);
      return;
    }

    setIsLoading(true);

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
      .then((data) => {
        setFeeds(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch feeds:", err);
        alert("Failed to fetch feeds. Please try again.");
        setFeeds([]);
        setIsLoading(false);
      });
  }, [folderId, feedUrl]);

  // Style for the main container
  const containerStyle = {};

  // Style for the feeddata container (where height should be applied)
  const feedDataStyle = {
    height: getFeedDataHeight(),
    maxHeight:
      heightType === "pixels"
        ? `${heightPixels}px`
        : heightType === "posts"
        ? `${heightPosts * feedItemHeight}px`
        : "50vh",
    overflowY: "auto",
    backgroundColor: backgroundColor || "#ffffff",
  };

  // Style for individual feed items
  const feedStyle = {
    fontFamily: fontStyle,
    textAlign: textAlign,
    padding: "1rem",
    borderRadius: "8px",
    width: "100%",
    backgroundColor: backgroundColor || "#ffffff",
  };

  const wrapperStyle = {
    width: widthType === "pixels" ? `${widthPixels}px` : "100%",
    border: border ? `2px solid ${borderColor} ` : "none",
    borderRadius: border ? "4px" : "0",
    overflow: "hidden",
    boxSizing: "border-box",
  };

  const feedTitleStyle = {
    fontWeight: customSettings.feedTitleBold ? "bold" : "normal",
    color: customSettings.feedTitleFontColor || "#000000",
    fontSize: customSettings.feedTitleFontSize
      ? `${customSettings.feedTitleFontSize}px`
      : "16px",
  };

  const feedDescriptionStyle = {
    fontWeight: customSettings.feedDescriptionBold ? "bold" : "normal",
  };

  const defaultSettings = {
    fontStyle: "Arial",
    textAlign: "left",
    border: false,
    borderColor: "#000000",
    widthType: "responsive",
    widthPixels: 350,
    heightType: "pixels",
    heightPixels: 400,
    heightPosts: 3,
    autoScroll: false,
    useCustomTitle: false,
    mainTitle: "Sunny",
    titleFontSize: 16,
    titleBold: true,
    titleFontColor: "#6d8cd1",
    titleBgColor: "#ffffff",
    useCustomContent: false,
    showFeedTitle: true,
    showFeedDescription: true,
    showFeedDate: true,
    feedTitleBold: false,
    feedDescriptionBold: false,
    feedTitleFontColor: "#6d8cd1",
    feedTitleFontSize: 16,
    backgroundColor: "#ffffff",
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      const cardWidth = 280;
      const gap = 16;
      const scrollAmount = cardWidth + gap;
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      const cardWidth = 280;
      const gap = 16;
      const scrollAmount = cardWidth + gap;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const isCardLayout = layout === "card1" || layout === "card2";

  const handleSave = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("User not logged in. Please log in first.");
      window.location.href = "/login";
      return;
    }

    if ((!folderId && !feedUrl) || !widgetName.trim()) {
      alert(
        "Please enter a widget name and either select a folder or enter a feed URL."
      );
      return;
    }

    if (editMode && !currentWidgetId) {
      alert("No widget ID provided for editing.");
      return;
    }
    const feedContentHeight =
      heightType === "posts" ? heightPosts * feedItemHeight : heightPixels;

    const titleStyles = titleRef.current
      ? getComputedStyle(titleRef.current)
      : { marginTop: "0", marginBottom: "0" };

    const titleMarginTop = parseInt(titleStyles.marginTop) || 0;
    const titleMarginBottom = parseInt(titleStyles.marginBottom) || 0;
    const fullTitleHeight =
      (titleRef.current?.offsetHeight || 0) +
      titleMarginTop +
      titleMarginBottom;

    const borderThickness = border ? 4 : 0;
    const calculatedHeight = Math.ceil(
      feedContentHeight + fullTitleHeight + borderThickness
    );

    const payload = {
      widgetName: widgetName.trim(),
      layout,
      folderId: folderId || null,
      rssUrl: feedUrl || null,
      actualHeight: calculatedHeight,
      customSettings: {
        fontStyle,
        textAlign,
        border,
        borderColor,
        widthType,
        widthPixels,
        heightType,
        heightPixels,
        heightPosts,
        autoScroll,
        useCustomTitle,
        mainTitle,
        titleFontSize,
        titleBold,
        titleFontColor,
        titleBgColor,
        useCustomContent,
        showFeedTitle,
        showFeedDescription,
        showFeedDate,
        feedTitleBold,
        feedDescriptionBold,
        feedTitleFontColor,
        feedTitleFontSize,
        backgroundColor,
      },
    };

    if (editMode) {
      payload.widgetId = currentWidgetId;
    }

    console.log("Saving widget with payload:", payload);

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

  const LoadingIndicator = () => (
    <div className={Styles.loadingContainer}>
      <div className={Styles.spinner}></div>
      <p>Loading feeds...</p>
    </div>
  );

  const getDisplayFeeds = () => {
    return Array.isArray(feeds) ? feeds : [];
  };

  return (
    <div className={Styles.container} style={containerStyle}>
      {/* Only show header, widget name input, and buttons if not in embedMode */}
      {!embedMode && (
        <>
          <div className={Styles.heading}>
            <h2>Feed Preview {editMode && "(Edit Mode)"}</h2>
            {autoScroll && (
              <div className={Styles.autoScrollIndicator}>
                <span className={Styles.autoScrollDot}></span>
                <small>Auto-scrolling</small>
              </div>
            )}
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
        </>
      )}

      <div className={isCardLayout ? Styles.cardWrapper : ""}>
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
        <div style={wrapperStyle}>
          {customSettings.useCustomTitle && (
            <div
              ref={titleRef}
              className={Styles.feedTitle}
              style={{
                backgroundColor: customSettings.titleBgColor,
                color: customSettings.titleFontColor,
                fontWeight: customSettings.titleBold ? "bold" : "normal",
                fontSize: `${customSettings.titleFontSize}px`,
                textAlign: "left",
                borderBottom: "1px solid #989191e4",
              }}
            >
              {customSettings.mainTitle || "Feed Title"}
            </div>
          )}
          {/* Apply height style to the feeddata container */}
          <div
            ref={scrollRef}
            className={`${Styles.feeddata} ${Styles[layout]} ${
              autoScroll ? Styles.autoScrolling : ""
            }`}
            style={{ ...feedDataStyle }}
          >
            {isLoading && <LoadingIndicator />}

            {!isLoading &&
              Array.isArray(feeds) &&
              getDisplayFeeds().map((feed, index) => (
                <div
                  key={`feed-${index}`}
                  ref={index === 0 ? feedItemRef : null}
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
                      alt={feed.title || "Feed image"}
                    />
                  )}
                  <div className={Styles.feedText}>
                    {customSettings.showFeedTitle && (
                      <h4 style={feedTitleStyle}>
                        <a
                          href={feed.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {feed.title}
                        </a>
                      </h4>
                    )}

                    {customSettings.showFeedDescription && (
                      <p style={feedDescriptionStyle}>{feed.description}</p>
                    )}

                    {customSettings.showFeedDate && <small>{feed.date}</small>}
                  </div>
                </div>
              ))}

            {!isLoading && (!feeds || feeds.length === 0) && (
              <div className={Styles.noFeedsMessage}>
                <p>
                  No feeds available. Please select a folder or enter a feed
                  URL.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
