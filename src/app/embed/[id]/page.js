// app/embed/[id]/page.js
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FeedDisplay from "../../components/FeedDisplay";

export default function EmbedWidgetPage() {
  const { id } = useParams();
  const [widgetData, setWidgetData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost/backend/getWidgetById.php?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setWidgetData(data.widget);
        } else {
          console.error("Failed to load widget");
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error loading widget:", err);
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) return <p>Loading widget...</p>;
  if (!widgetData) return <p>Widget not found.</p>;

  return (
    <div
      style={{
        background: "#fff",
        width:
          widgetData.widthType === "pixels"
            ? `${widgetData.widthPixels || 350}px`
            : "100%",
        padding: 0,
        margin: 0,
        // overflow: "hidden",
      }}
    >
      <FeedDisplay
        folderId={widgetData.folder_id}
        view={widgetData.layout.startsWith("grid") ? "grid" : widgetData.layout}
        layout={widgetData.layout}
        customSettings={{
          fontStyle: widgetData.fontStyle || "Arial",
          textAlign: widgetData.textAlign || "left",
          border:
            widgetData.border === true ||
            widgetData.border === 1 ||
            widgetData.border === "1",
          borderColor: widgetData.borderColor || "#000000",
          widthType: widgetData.widthType || "responsive",
          widthPixels: widgetData.widthPixels || 350,
          heightType: widgetData.heightType || "pixels",
          heightPixels: widgetData.heightPixels || 350,
          heightPosts: widgetData.heightPosts || 3,
          autoScroll: widgetData.autoScroll || false,
          useCustomTitle: widgetData.useCustomTitle || false,
          mainTitle: widgetData.mainTitle || "",
          titleFontSize: widgetData.titleFontSize || 16,
          titleBold: widgetData.titleBold ?? false,
          titleFontColor: widgetData.titleFontColor || "#0080ff",
          titleBgColor: widgetData.titleBgColor || "#ffffff",
          useCustomContent: widgetData.useCustomContent || false,
          showFeedTitle: widgetData.showFeedTitle ?? true,
          showFeedDescription: widgetData.showFeedDescription ?? true,
          showFeedDate: widgetData.showFeedDate ?? true,
          feedTitleBold: widgetData.feedTitleBold ?? false,
          feedDescriptionBold: widgetData.feedDescriptionBold ?? false,
          feedTitleFontColor: widgetData.feedTitleFontColor || "#6d8cd1",
          feedTitleFontSize: widgetData.feedTitleFontSize || 16,
          backgroundColor: widgetData.backgroundColor || "#ffffff",
        }}
        widgetName={widgetData.widget_name}
        feedUrl={widgetData.rss_url}
        editMode={false}
        embedMode={true}
      />
    </div>
  );
}
