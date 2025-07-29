import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useWidgetManagementStore = create(
  devtools(
    (set, get) => ({
      // State
      widgets: [],
      isLoading: false,
      selectedWidget: null,
      isModalOpen: false,
      editingWidgetId: null,
      editedName: "",

      // Actions
      setWidgets: (widgets) => set({ widgets }, false, "setWidgets"),

      setIsLoading: (loading) =>
        set({ isLoading: loading }, false, "setIsLoading"),

      setSelectedWidget: (widget) =>
        set({ selectedWidget: widget }, false, "setSelectedWidget"),

      setIsModalOpen: (open) =>
        set({ isModalOpen: open }, false, "setIsModalOpen"),

      setEditingWidgetId: (id) =>
        set({ editingWidgetId: id }, false, "setEditingWidgetId"),

      setEditedName: (name) =>
        set({ editedName: name }, false, "setEditedName"),

      // Fetch widgets from API
      fetchWidgets: async () => {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No token found");
        }

        set({ isLoading: true }, false, "fetchWidgets:start");

        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/getWidgets.php`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await response.json();

          if (data.success === false) {
            throw new Error(data.error || "Failed to fetch widgets");
          }

          set(
            {
              widgets: data || [],
              isLoading: false,
            },
            false,
            "fetchWidgets:success"
          );

          return { success: true, widgets: data || [] };
        } catch (error) {
          console.error("Failed to fetch widgets:", error);
          set(
            {
              isLoading: false,
              widgets: [],
            },
            false,
            "fetchWidgets:error"
          );

          return { success: false, error: error.message };
        }
      },

      // Delete widget
      deleteWidget: async (widgetId) => {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No token found");
        }

        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/deleteWidget.php`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ id: widgetId }),
            }
          );

          const data = await response.json();

          if (data.success) {
            // Remove widget from local state
            set(
              (state) => ({
                widgets: state.widgets.filter((w) => w.id !== widgetId),
              }),
              false,
              "deleteWidget:success"
            );

            return { success: true };
          } else {
            throw new Error("Failed to delete widget");
          }
        } catch (error) {
          console.error("Delete widget error:", error);
          return { success: false, error: error.message };
        }
      },

      // Update widget name
      updateWidgetName: async (widgetId, newName) => {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No token found");
        }

        if (!newName.trim()) {
          throw new Error("Widget name cannot be empty");
        }

        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/updateWidgetName.php`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                id: widgetId,
                widget_name: newName.trim(),
              }),
            }
          );

          const data = await response.json();

          if (data.success) {
            // Update widget in local state
            set(
              (state) => ({
                widgets: state.widgets.map((w) =>
                  w.id === widgetId ? { ...w, widget_name: newName.trim() } : w
                ),
                editingWidgetId: null,
                editedName: "",
              }),
              false,
              "updateWidgetName:success"
            );

            return { success: true };
          } else {
            throw new Error("Failed to update widget name");
          }
        } catch (error) {
          console.error("Update widget name error:", error);
          return { success: false, error: error.message };
        }
      },

      // Start editing widget name
      startEditingName: (widgetId, currentName) => {
        set(
          {
            editingWidgetId: widgetId,
            editedName: currentName,
          },
          false,
          "startEditingName"
        );
      },

      // Cancel editing widget name
      cancelEditingName: () => {
        set(
          {
            editingWidgetId: null,
            editedName: "",
          },
          false,
          "cancelEditingName"
        );
      },

      // Show embed code modal
      showEmbedCode: (widget) => {
        set(
          {
            selectedWidget: widget,
            isModalOpen: true,
          },
          false,
          "showEmbedCode"
        );
      },

      // Close embed code modal
      closeEmbedCode: () => {
        set(
          {
            selectedWidget: null,
            isModalOpen: false,
          },
          false,
          "closeEmbedCode"
        );
      },

      // Generate embed code
      generateEmbedCode: (widget) => {
        const width =
          widget.widthType === "pixels" ? `${widget.widthPixels}px` : "100%";
        const height = `${widget.actualHeight || 400}px`;

        return `<iframe src="http://localhost:3000/embed/${widget.id}" style="width: ${width}; height: ${height}; border: none;" loading="lazy"></iframe>`;
      },

      // Copy embed code to clipboard
      copyEmbedCode: async (widget) => {
        const { generateEmbedCode } = get();
        const embedCode = generateEmbedCode(widget);

        try {
          await navigator.clipboard.writeText(embedCode);
          return { success: true };
        } catch (error) {
          console.error("Failed to copy to clipboard:", error);
          return { success: false, error: "Failed to copy to clipboard" };
        }
      },

      // Reset store
      reset: () => {
        set(
          {
            widgets: [],
            isLoading: false,
            selectedWidget: null,
            isModalOpen: false,
            editingWidgetId: null,
            editedName: "",
          },
          false,
          "reset"
        );
      },
    }),
    {
      name: "widget-management-store",
    }
  )
);
