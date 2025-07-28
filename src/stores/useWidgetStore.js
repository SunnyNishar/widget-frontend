import { create } from "zustand";
import { devtools } from "zustand/middleware";

// Default custom settings
const defaultCustomSettings = {
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
};

export const useWidgetStore = create(
  devtools(
    (set, get) => ({
      // Widget Basic Info
      widgetName: "",
      currentWidgetId: null,
      editMode: false,
      isLoading: false,

      feedUrl: "",
      tempFeedUrl: "",
      selectedFolderId: "",

      view: "grid",
      selectedLayout: "",

      customSettings: defaultCustomSettings,

      folders: [],

      // Actions
      setWidgetName: (name) =>
        set({ widgetName: name }, false, "setWidgetName"),

      setFeedUrl: (url) => set({ feedUrl: url }, false, "setFeedUrl"),

      setTempFeedUrl: (url) =>
        set({ tempFeedUrl: url }, false, "setTempFeedUrl"),

      setSelectedFolderId: (folderId) =>
        set({ selectedFolderId: folderId }, false, "setSelectedFolderId"),

      setView: (view) => set({ view }, false, "setView"),

      setSelectedLayout: (layout) =>
        set({ selectedLayout: layout }, false, "setSelectedLayout"),

      setCustomSettings: (settings) => {
        set(
          (state) => ({
            customSettings: { ...state.customSettings, ...settings },
          }),
          false,
          "setCustomSettings"
        );
      },

      updateCustomSetting: (key, value) => {
        set(
          (state) => ({
            customSettings: { ...state.customSettings, [key]: value },
          }),
          false,
          `updateCustomSetting:${key}`
        );
      },

      setFolders: (folders) => set({ folders }, false, "setFolders"),

      setIsLoading: (loading) =>
        set({ isLoading: loading }, false, "setIsLoading"),

      // Edit Mode Actions
      startEditMode: (widgetId) =>
        set(
          {
            editMode: true,
            currentWidgetId: widgetId,
          },
          false,
          "startEditMode"
        ),

      exitEditMode: () =>
        set(
          {
            editMode: false,
            currentWidgetId: null,
          },
          false,
          "exitEditMode"
        ),

      loadFeedFromUrl: (rssUrl) => {
        const { editMode } = get();
        set(
          {
            feedUrl: rssUrl,
            tempFeedUrl: rssUrl,
            // Reset edit mode if loading new category
            ...(editMode && {
              widgetName: "",
              editMode: false,
              currentWidgetId: null,
            }),
          },
          false,
          "loadFeedFromUrl"
        );
      },

      // Load widget data for editing
      loadWidgetForEdit: async (widgetId) => {
        set({ isLoading: true }, false, "loadWidgetForEdit:start");

        try {
          const response = await fetch(
            `http://localhost/backend/getWidgetById.php?id=${widgetId}`
          );
          const data = await response.json();

          if (data.success) {
            const widget = data.widget;

            let view = "grid";
            if (widget.layout) {
              if (widget.layout.startsWith("grid")) view = "grid";
              else if (widget.layout.startsWith("list")) view = "list";
              else if (widget.layout.startsWith("card")) view = "card";
              else if (widget.layout.startsWith("matrix")) view = "matrix";
            }

            set(
              {
                editMode: true,
                currentWidgetId: widgetId,
                feedUrl: widget.rss_url || "",
                tempFeedUrl: widget.rss_url || "",
                selectedFolderId: widget.folder_id || "",
                widgetName: widget.widget_name || "",
                selectedLayout: widget.layout || "",
                view,
                customSettings: {
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
                  backgroundColor: widget.backgroundColor || "#ffffff",
                },
                isLoading: false,
              },
              false,
              "loadWidgetForEdit:success"
            );

            return { success: true };
          } else {
            throw new Error(data.error || "Failed to load widget");
          }
        } catch (error) {
          console.error("Failed to load widget:", error);
          set({ isLoading: false }, false, "loadWidgetForEdit:error");
          return { success: false, error: error.message };
        }
      },

      // Reset widget state
      resetWidget: () =>
        set(
          {
            widgetName: "",
            currentWidgetId: null,
            editMode: false,
            feedUrl: "",
            tempFeedUrl: "",
            selectedFolderId: "",
            view: "grid",
            selectedLayout: "",
            customSettings: defaultCustomSettings,
          },
          false,
          "resetWidget"
        ),

      // Handle folder selection (clears feed URL)
      selectFolder: (folderId) =>
        set(
          {
            selectedFolderId: folderId,
            feedUrl: "",
            tempFeedUrl: "",
          },
          false,
          "selectFolder"
        ),

      // Handle manual feed URL entry (clears folder selection)
      enterFeedUrl: (url) =>
        set(
          {
            tempFeedUrl: url,
            selectedFolderId: "",
          },
          false,
          "enterFeedUrl"
        ),

      // Load preview (apply temp URL to actual feed URL)
      loadPreview: () => {
        const { tempFeedUrl } = get();
        if (tempFeedUrl.trim()) {
          set({ feedUrl: tempFeedUrl.trim() }, false, "loadPreview");
        }
      },
    }),
    {
      name: "widget-store",
    }
  )
);
