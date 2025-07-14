"use client";
import React, { useState } from "react";
import styles from "./widgetform.module.css";
import Image from "next/image";
import Buttons from "./buttons";
import { useEffect } from "react";
import preview1 from "@/assets/card1.webp";
import preview2 from "@/assets/card2.webp";
import preview3 from "@/assets/card3.webp";
import preview4 from "@/assets/card4.webp";
import preview5 from "@/assets/card5.webp";
import preview6 from "@/assets/card6.webp";
import preview7 from "@/assets/card7.webp";
import WidgetCustomizer from "./WidgetCustomizer";

export default function WidgetForm({
  selectedFolderId,
  setSelectedFolderId,
  view,
  setView,
  selectedLayout,
  setSelectedLayout,
  onSettingsChange,
  customSettings,
  setFeedUrl,
  tempFeedUrl,
  setTempFeedUrl,
}) {
  const [folders, setFolders] = useState([]);

  // const [selectedlayout, setSelectedLayout] = useState("");
  // const [selectedFolderId, setSelectedFolderId] = useState('');
  // const [selectedFeedUrl, setSelectedFeedUrl] = useState('');

  // const [view, setView] = useState("grid");
  // const [selectedPreview, setSelectedPreview] = useState(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/getFolders.php`)
      .then((res) => res.json())
      .then((data) => setFolders(data))
      .catch((err) => console.error("Failed to fetch folders:", err));
  }, []);
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
          onChange={(e) => {
            setTempFeedUrl(e.target.value);
            setSelectedFolderId(""); // clear folder selection if manually entering URL
          }}
          placeholder="https://example.com/rss"
        />
        <button
          className={styles.loadButton}
          onClick={() => {
            if (tempFeedUrl.trim()) {
              setFeedUrl(tempFeedUrl.trim());
            }
          }}
        >
          Load Preview
        </button>
        <br />
        <p>Or Select Feedspot Folder URL</p>
        <select
          value={selectedFolderId}
          onChange={(e) => {
            setSelectedFolderId(e.target.value);
            setFeedUrl(""); // clear feed URL if folder is selected
          }}
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
        onSettingsChange={onSettingsChange}
        customSettings={customSettings}
      />
    </div>
  );
}
