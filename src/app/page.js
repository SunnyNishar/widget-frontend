"use client";
import { useState } from "react";
import FeedDisplay from "./components/FeedDisplay";
import Sidebar from "./components/sidebar";
import WidgetForm from "./components/widegtform";
import styles from "./page.module.css";
import Head from "next/head";

export default function Home() {
  const [selectedFolderId, setSelectedFolderId] = useState(""); // moved up!
  const [view, setView] = useState("grid");
  const [selectedLayout, setSelectedLayout] = useState("");
  const [customSettings, setCustomSettings] = useState({
    fontStyle: "Arial",
    textAlign: "left",
    border: false,
    borderColor: "#000000",
  });

  return (
    <main className={styles.container}>
      <Head>
        <title>FeedSpot</title>
      </Head>
      <Sidebar />
      <WidgetForm
        setSelectedFolderId={setSelectedFolderId}
        selectedFolderId={selectedFolderId}
        view={view}
        setView={setView}
        selectedLayout={selectedLayout}
        setSelectedLayout={setSelectedLayout}
        onSettingsChange={setCustomSettings}
      />
      <FeedDisplay
        folderId={selectedFolderId}
        view={view}
        layout={selectedLayout}
        customSettings={customSettings}
      />
    </main>
  );
}
