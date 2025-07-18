"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import FeedDisplay from "../components/FeedDisplay";
import WidgetForm from "../components/widegtform";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (!token) router.push("/login");
    };
    checkAuth();
  }, [router]);
  const searchParams = useSearchParams();
  const editWidgetId = searchParams.get("edit");
  const [tempFeedUrl, setTempFeedUrl] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState("");
  const [view, setView] = useState("grid");
  const [feedUrl, setFeedUrl] = useState("");
  const [selectedLayout, setSelectedLayout] = useState("");
  const [customSettings, setCustomSettings] = useState({
    fontStyle: "Arial",
    textAlign: "left",
    border: false,
    borderColor: "#000000",
    widthType: "responsive",
    widthPixels: 350,
    heightType: "pixels",
    heightPixels: 350,
    heightPosts: 3, // Default to showing 3 posts
    autoScroll: false, // Default to no auto-scroll
    useCustomTitle: false, // Default to not using custom title
    mainTitle: "", // Default title
    titleFontSize: 16, // Default title font size
    titleBold: true, // Default title bold
    titleFontColor: "#6d8cd1", // Default title font color
    titleBgColor: "#ffffff", // Default title background color
    useCustomContent: false, // Default to not using custom content
    showFeedTitle: true, // Default to showing feed title
    showFeedDescription: true, // Default to showing feed description
    showFeedDate: true, // Default to showing feed date
    feedTitleBold: false, // Default to not bolding feed title
    feedDescriptionBold: false, // Default to not bolding feed description
    feedTitleFontColor: "#6d8cd1", // Default feed title font color
    feedTitleFontSize: 16, // Default feed title font size
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

            setFeedUrl(widget.rss_url || "");
            setTempFeedUrl(widget.rss_url || "");
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
            // Handle both old and new width format
            const widthValue = widget.width || widget.widthPixels || 350;
            const isPixelWidth =
              widget.widthType === "pixels" ||
              (widget.width && widget.width.includes("px"));
            const settings = widget.settings;
            console.log("Widget from backend:", widget);
            console.log("Parsed settings:", settings);
            setCustomSettings({
              fontStyle: widget.fontStyle || "Arial",
              textAlign: widget.textAlign || "left",
              border:
                widget.border === true ||
                widget.border === 1 ||
                widget.border === "1",
              borderColor: widget.borderColor || "#000000",
              widthType: widget.widthType || "responsive",
              widthPixels: widget.widthPixels || 350,
              heightType: widget.heightType || "pixels",
              heightPixels: widget.heightPixels || 350,
              heightPosts: widget.heightPosts || 3,
              autoScroll: widget.autoScroll || false,
              useCustomTitle: widget.useCustomTitle || false,
              mainTitle: widget.mainTitle || "",
              titleFontSize: widget.titleFontSize || 16,
              titleBold: widget.titleBold ?? false,
              titleFontColor: widget.titleFontColor || "#0080ff",
              titleBgColor: widget.titleBgColor || "#ffffff",
              useCustomContent: widget.useCustomContent || false,
              showFeedTitle: widget.showFeedTitle ?? true,
              showFeedDescription: widget.showFeedDescription ?? true,
              showFeedDate: widget.showFeedDate ?? true,
              feedTitleBold: widget.feedTitleBold ?? false,
              feedDescriptionBold: widget.feedDescriptionBold ?? false,
              feedTitleFontColor: widget.feedTitleFontColor || "#6d8cd1",
              feedTitleFontSize: widget.feedTitleFontSize || 16,
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
  useEffect(() => {
    const rssFromCategory = searchParams.get("feed");

    if (rssFromCategory && !editWidgetId) {
      setFeedUrl(rssFromCategory);
      setTempFeedUrl(rssFromCategory);
    }
  }, [searchParams, editWidgetId]);

  if (isLoading) {
    return (
      <main className={styles.container}>
        <div className={styles.loading}>Loading widget...</div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      {/* <Sidebar /> */}
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
            feedUrl={feedUrl}
            setFeedUrl={setFeedUrl}
            tempFeedUrl={tempFeedUrl}
            setTempFeedUrl={setTempFeedUrl}
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
            feedUrl={feedUrl}
            currentWidgetId={currentWidgetId}
          />
        </div>
      </div>
    </main>
  );
}
