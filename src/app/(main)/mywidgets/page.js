"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "react-modal";
import Link from "next/link";
import { useAuthStore } from "@/stores/useAuthStore";
import { useWidgetManagementStore } from "@/stores/useWidgetManagementStore";
import { useWidgetStore } from "@/stores/useWidgetStore";
import { isTokenExpired } from "../../../utils/auth";
import Styles from "./mywidgets.module.css";

export default function MyWidgetsPage() {
  const router = useRouter();
  const sessionHandled = useRef(false);

  // Auth store
  const { isAuthenticated, checkAuth, logout } = useAuthStore();
  const handleCreateNewWidget = () => {
    const { resetWidget } = useWidgetStore.getState();
    resetWidget();
  };
  // Widget management store
  const {
    // State
    widgets,
    isLoading,
    selectedWidget,
    isModalOpen,
    editingWidgetId,
    editedName,

    // Actions
    fetchWidgets,
    deleteWidget,
    updateWidgetName,
    startEditingName,
    cancelEditingName,
    showEmbedCode,
    closeEmbedCode,
    copyEmbedCode,
    setEditedName,
    reset: resetWidgetStore,
  } = useWidgetManagementStore();

  // Initialize and check authentication
  useEffect(() => {
    if (sessionHandled.current) return;

    const token = localStorage.getItem("token");

    if (!token || isTokenExpired(token)) {
      sessionHandled.current = true;
      logout();
      alert("Session Token expired. Please log in again.");
      router.push("/login");
      return;
    }

    const isAuth = checkAuth();
    if (!isAuth) {
      sessionHandled.current = true;
      router.push("/login");
      return;
    }

    // Fetch widgets
    fetchWidgets().then((result) => {
      if (!result.success) {
        if (
          result.error.includes("Auth failed") ||
          result.error.includes("token")
        ) {
          sessionHandled.current = true;
          logout();
          router.push("/login");
        } else {
          console.error("Failed to fetch widgets:", result.error);
        }
      }
    });

    return () => {
      // Cleanup when component unmounts
      resetWidgetStore();
    };
  }, [checkAuth, fetchWidgets, logout, router, resetWidgetStore]);

  // Handle widget deletion with confirmation
  const handleDelete = async (widgetId) => {
    if (!window.confirm("Are you sure you want to delete this widget?")) {
      return;
    }

    const result = await deleteWidget(widgetId);

    if (result.success) {
      // Widget already removed from state by the store action
    } else {
      alert(result.error || "Failed to delete widget.");
    }
  };

  // Handle widget editing (navigate to edit page)
  const handleEdit = (widgetId) => {
    router.push(`/?edit=${widgetId}`);
  };

  // Handle save widget name
  const handleSaveWidgetName = async (widgetId) => {
    const result = await updateWidgetName(widgetId, editedName);

    if (!result.success) {
      alert(result.error || "Failed to update widget name.");
    }
    // Success state is handled by the store
  };

  // Handle embed code copying
  const handleCopyEmbedCode = async (widget) => {
    const result = await copyEmbedCode(widget);

    if (result.success) {
      alert("Embed code copied to clipboard!");
    } else {
      alert(result.error || "Failed to copy embed code.");
    }
  };

  // Animation variants
  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: -50 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, y: -50, transition: { duration: 0.2 } },
  };

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <motion.div
      className={Styles.wrapper}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className={Styles.main}>
        <h1 className={Styles.heading}>My Widgets</h1>

        <div className={Styles.topButtons}>
          <Link href="/" onClick={handleCreateNewWidget}>
            <motion.button
              className={Styles.createBtn}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Create New Widget
            </motion.button>
          </Link>
          <Link href="https://youtu.be/ea-ybXtsOCc" target="_blank">
            <motion.button
              className={Styles.learnBtn}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Learn More
            </motion.button>
          </Link>
        </div>

        {isLoading ? (
          <div className={Styles.loader}>Loading...</div>
        ) : widgets.length === 0 ? (
          <p style={{ textAlign: "center" }}>No widgets found.</p>
        ) : (
          <table className={Styles.table}>
            <thead>
              <tr>
                <th>Widget Name</th>
                <th>Feed URL / Folder Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {widgets.map((widget) => (
                  <motion.tr
                    key={widget.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    layout
                  >
                    <td>
                      {editingWidgetId === widget.id ? (
                        <>
                          <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleSaveWidgetName(widget.id);
                              } else if (e.key === "Escape") {
                                cancelEditingName();
                              }
                            }}
                            className={Styles.inlineInput}
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveWidgetName(widget.id)}
                            className={Styles.inlineSaveBtn}
                            title="Save"
                          >
                            ✅
                          </button>
                          <button
                            onClick={cancelEditingName}
                            className={Styles.inlineCancelBtn}
                            title="Cancel"
                          >
                            ❌
                          </button>
                        </>
                      ) : (
                        <div className={Styles.nameCell}>
                          <span>{widget.widget_name}</span>
                          <button
                            onClick={() =>
                              startEditingName(widget.id, widget.widget_name)
                            }
                            className={Styles.inlineEditBtn}
                            title="Edit name"
                          >
                            ✏️
                          </button>
                        </div>
                      )}
                    </td>

                    <td>
                      {widget.folder_name ? (
                        widget.folder_name
                      ) : widget.rss_url ? (
                        <a
                          href={widget.rss_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={widget.rss_url}
                        >
                          {widget.rss_url.length > 30
                            ? `${widget.rss_url.substring(0, 30)}...`
                            : widget.rss_url}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </td>

                    <td>
                      <motion.button
                        onClick={() => handleDelete(widget.id)}
                        className={Styles.actionBtn}
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        title="Delete Widget"
                      >
                        Delete
                      </motion.button>

                      <motion.button
                        onClick={() => showEmbedCode(widget)}
                        className={Styles.actionBtn}
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        title="Get Embed Code"
                      >
                        Embed Code
                      </motion.button>

                      <motion.button
                        onClick={() => handleEdit(widget.id)}
                        className={Styles.actionBtn}
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        title="Edit Widget"
                      >
                        Edit Widget
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        )}

        {/* Embed Code Modal */}
        <AnimatePresence>
          {isModalOpen && selectedWidget && (
            <Modal
              ariaHideApp={false}
              isOpen={isModalOpen}
              onRequestClose={closeEmbedCode}
              contentLabel="Embed Code Modal"
              className={Styles.modalContent}
              overlayClassName={Styles.modalOverlay}
            >
              <motion.div
                className={Styles.modalBox}
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <h2>Embed Code</h2>
                <p>
                  This is the embed code for widget:{" "}
                  {selectedWidget.widget_name}
                </p>

                <textarea
                  readOnly
                  value={`<iframe src="http://localhost:3000/embed/${
                    selectedWidget.id
                  }" style="width: ${
                    selectedWidget.widthType === "pixels"
                      ? `${selectedWidget.widthPixels}px`
                      : "100%"
                  }; height: ${
                    selectedWidget.actualHeight || 400
                  }px; border: none;" loading="lazy"></iframe>`}
                  style={{
                    width: "100%",
                    height: "120px",
                    marginTop: "10px",
                    fontFamily: "monospace",
                    fontSize: "12px",
                  }}
                />

                <div
                  style={{ marginTop: "15px", display: "flex", gap: "10px" }}
                >
                  <motion.button
                    onClick={() => handleCopyEmbedCode(selectedWidget)}
                    className={Styles.actionBtn}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    Copy Code
                  </motion.button>

                  <motion.button
                    onClick={closeEmbedCode}
                    className={Styles.actionBtn}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    Close
                  </motion.button>
                </div>
              </motion.div>
            </Modal>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
