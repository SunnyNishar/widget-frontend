"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import FeedDisplay from "./components/FeedDisplay";
import Sidebar from "./components/sidebar";
import WidgetForm from "./components/widegtform";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem("user");
      if (!user) {
        router.push("/login"); // or use push if you prefer history stack
      }
    };
    checkAuth();
  }, [router]);
  const searchParams = useSearchParams();
  const editWidgetId = searchParams.get("edit");

  const [selectedFolderId, setSelectedFolderId] = useState("");
  const [view, setView] = useState("grid");
  const [selectedLayout, setSelectedLayout] = useState("");
  const [customSettings, setCustomSettings] = useState({
    fontStyle: "Arial",
    textAlign: "left",
    border: false,
    borderColor: "#000000",
  });
  const [widgetName, setWidgetName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentWidgetId, setCurrentWidgetId] = useState(null);

  // Load widget data if in edit mode
  useEffect(() => {
    if (editWidgetId) {
      setIsLoading(true);
      setEditMode(true);
      setCurrentWidgetId(editWidgetId);

      fetch(`http://localhost/backend/getWidgetById.php?id=${editWidgetId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            const widget = data.widget;

            // Set all the form states with the widget data
            setSelectedFolderId(widget.folder_id || "");
            setWidgetName(widget.widget_name || "");
            setSelectedLayout(widget.layout || "");

            if (widget.layout) {
              if (widget.layout.startsWith("grid")) setView("grid");
              else if (widget.layout.startsWith("list")) setView("list");
              else if (widget.layout.startsWith("card")) setView("card");
              else if (widget.layout.startsWith("matrix")) setView("matrix");
            }

            setCustomSettings({
              fontStyle: widget.font_style || "Arial",
              textAlign: widget.text_align || "left",
              border:
                widget.add_border == 1 ||
                widget.add_border === true ||
                widget.add_border === "1",
              borderColor: widget.border_color || "#000000",
            });
          } else {
            alert("Failed to load widget data");
            console.error(data.error);
          }
        })
        .catch((err) => {
          console.error("Failed to load widget:", err);
          alert("Failed to load widget data");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [editWidgetId]);

  if (isLoading) {
    return (
      <main className={styles.container}>
        <div className={styles.loading}>Loading widget...</div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <Sidebar />
      <div className={styles.contentWrapper}>
        <div className={styles.formSection}>
          <WidgetForm
            setSelectedFolderId={setSelectedFolderId}
            selectedFolderId={selectedFolderId}
            view={view}
            setView={setView}
            selectedLayout={selectedLayout}
            setSelectedLayout={setSelectedLayout}
            onSettingsChange={setCustomSettings}
            customSettings={customSettings}
            setCustomSettings={setCustomSettings}
            editMode={editMode}
          />
        </div>
        <div className={styles.previewSection}>
          <FeedDisplay
            folderId={selectedFolderId}
            view={view}
            layout={selectedLayout}
            customSettings={customSettings}
            setCustomSettings={setCustomSettings}
            widgetName={widgetName}
            setWidgetName={setWidgetName}
            editMode={editMode}
            currentWidgetId={currentWidgetId}
          />
        </div>
      </div>
    </main>
  );
}
