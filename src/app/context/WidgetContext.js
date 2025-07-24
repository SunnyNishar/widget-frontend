"use client";
import { createContext, useContext, useState } from "react";

// Create the context
const WidgetContext = createContext();

// Custom hook for easier access
export const useWidget = () => useContext(WidgetContext);

// Provider component
export const WidgetProvider = ({ children }) => {
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
    heightPosts: 3,
    autoScroll: false,
    useCustomTitle: false,
    mainTitle: "",
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
  });
  const [widgetName, setWidgetName] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [currentWidgetId, setCurrentWidgetId] = useState(null);

  return (
    <WidgetContext.Provider
      value={{
        tempFeedUrl,
        setTempFeedUrl,
        selectedFolderId,
        setSelectedFolderId,
        view,
        setView,
        feedUrl,
        setFeedUrl,
        selectedLayout,
        setSelectedLayout,
        customSettings,
        setCustomSettings,
        widgetName,
        setWidgetName,
        editMode,
        setEditMode,
        currentWidgetId,
        setCurrentWidgetId,
      }}
    >
      {children}
    </WidgetContext.Provider>
  );
};
