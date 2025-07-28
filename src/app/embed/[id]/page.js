// app/embed/[id]/page.js
"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import FeedDisplay from "../../components/FeedDisplay";
import { useWidgetStore } from "../../../stores/useWidgetStore";

export default function EmbedWidgetPage() {
  const { id } = useParams();

  const {
    loadWidgetForEdit,
    customSettings,
    feedUrl,
    selectedFolderId,
    selectedLayout,
    view,
    widgetName,
    isLoading,
  } = useWidgetStore();

  useEffect(() => {
    if (id) {
      loadWidgetForEdit(id); // Load widget from backend into Zustand
    }
  }, [id, loadWidgetForEdit]);

  if (isLoading) return <p>Loading widget...</p>;
  if (!feedUrl && !selectedFolderId) return <p>Widget not found.</p>;

  return (
    <div
      style={{
        background: "#fff",
        width:
          customSettings.widthType === "pixels"
            ? `${customSettings.widthPixels || 350}px`
            : "100%",
        height: "100%",
        padding: 0,
        margin: 0,
        overflow: "hidden",
      }}
    >
      <FeedDisplay
        folderId={selectedFolderId}
        view={view}
        layout={selectedLayout}
        customSettings={customSettings}
        widgetName={widgetName}
        feedUrl={feedUrl}
        editMode={false}
        embedMode={true}
        currentWidgetId={id}
      />
    </div>
  );
}
