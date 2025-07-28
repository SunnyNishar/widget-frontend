"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useWidgetStore } from "@/stores/useWidgetStore";
import Buttons from "./buttons";
import WidgetCustomizer from "./WidgetCustomizer";
import styles from "./widgetform.module.css";

// Import preview images
import preview1 from "@/assets/card1.webp";
import preview2 from "@/assets/card2.webp";
import preview3 from "@/assets/card3.webp";
import preview4 from "@/assets/card4.webp";
import preview5 from "@/assets/card5.webp";
import preview6 from "@/assets/card6.webp";
import preview7 from "@/assets/card7.webp";

export default function WidgetForm() {
  // Get state and actions from Zustand store
  const {
    // State
    folders,
    selectedFolderId,
    tempFeedUrl,
    view,
    selectedLayout,
    customSettings,

    // Actions
    setFolders,
    selectFolder,
    enterFeedUrl,
    loadPreview,
    setView,
    setSelectedLayout,
    setCustomSettings,
  } = useWidgetStore();

  // Fetch folders on component mount
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/getFolders.php`)
      .then((res) => res.json())
      .then((data) => setFolders(data))
      .catch((err) => console.error("Failed to fetch folders:", err));
  }, [setFolders]);

  const previewMap = {
    list: [preview3],
    matrix: [preview4, preview5],
    card: [preview6, preview7],
    grid: [preview1, preview2], // Default
  };

  const renderPreviews = () => {
    const previews = previewMap[view];

    return previews.map((imgSrc, idx) => {
      const layoutName = `${view}${idx + 1}`;
      const isSelected = selectedLayout === layoutName;

      return (
        <div
          className={`${styles.preview2} ${isSelected ? styles.selected : ""}`}
          key={idx}
        >
          <button onClick={() => setSelectedLayout(layoutName)}>
            <Image
              src={imgSrc}
              width={250}
              height={300}
              alt="No Preview available"
            />
          </button>
        </div>
      );
    });
  };

  return (
    <div className={styles.maindiv}>
      <div className={styles.heading}>
        <h1>Feedspot widgets</h1>
      </div>

      <div className={styles.urlInput}>
        <p>Enter Feed URL</p>
        <input
          type="text"
          value={tempFeedUrl}
          onChange={(e) => enterFeedUrl(e.target.value)}
          placeholder="https://example.com/rss"
        />
        <button
          type="submit"
          className={styles.loadButton}
          onClick={loadPreview}
        >
          Load Preview
        </button>

        <br />
        <p>Or Select Feedspot Folder URL</p>
        <select
          value={selectedFolderId}
          onChange={(e) => selectFolder(e.target.value)}
        >
          <option value="">-- Select a Folder --</option>
          {folders.map((folder) => (
            <option key={folder.id} value={folder.id}>
              {folder.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.heading}>
        <h1>Following Views</h1>
        <Buttons setView={setView} currentView={view} />
      </div>

      <div className={styles.preview}>{renderPreviews()}</div>

      <WidgetCustomizer
        onSettingsChange={setCustomSettings}
        customSettings={customSettings}
      />
    </div>
  );
}
