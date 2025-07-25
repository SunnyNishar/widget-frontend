"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Styles from "./mywidgets.module.css";
import Modal from "react-modal";
import Link from "next/link";
import { isTokenExpired } from "../../../utils/auth";

export default function MyWidgetsPage() {
  const [widgets, setWidgets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  // const [authenticated, setAuthenticated] = useState(false);
  const sessionHandled = useRef(false);
  const [editingWidgetId, setEditingWidgetId] = useState(null);
  const [editedName, setEditedName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (sessionHandled.current) return;
    if (!token || isTokenExpired(token)) {
      sessionHandled.current = true;
      localStorage.removeItem("token");
      alert("Session Token expired. Please log in again.");
      router.push("/login");
      return; // 🚨 prevent further code
    }
    // setAuthenticated(true);

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/getWidgets.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success === false) {
          sessionHandled.current = true;
          console.error("Auth failed:", data.error);
          router.push("/login"); // invalid token
        } else {
          setWidgets(data || []);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch widgets:", err);
        setIsLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Not logged in.");
      router.push("/login");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this widget?")) return;

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/deleteWidget.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setWidgets((prev) => prev.filter((w) => w.id !== id));
        } else {
          alert("Failed to delete widget.");
        }
      })
      .catch((err) => {
        alert("An error occurred while deleting.");
        console.error(err);
      });
  };

  const handleEdit = (widgetId) => {
    router.push(`/?edit=${widgetId}`);
  };
  const handleSaveWidgetName = (widgetId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Not logged in.");
      router.push("/login");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/updateWidgetName.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: widgetId,
        widget_name: editedName.trim(),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setWidgets((prev) =>
            prev.map((w) =>
              w.id === widgetId ? { ...w, widget_name: editedName.trim() } : w
            )
          );
          setEditingWidgetId(null);
        } else {
          alert("Failed to update widget name.");
        }
      })
      .catch((err) => {
        console.error("Error updating widget name:", err);
        alert("An error occurred.");
      });
  };

  const handleShowEmbedCode = (widget) => {
    setSelectedWidget(widget);
    setIsModalOpen(true);
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: -50 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, y: -50, transition: { duration: 0.2 } },
  };
  // if (!authenticated) return null;
  return (
    <motion.div
      className={Styles.wrapper}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* <Sidebar /> */}
      <div className={Styles.main}>
        <h1 className={Styles.heading}>My Widgets</h1>

        <div className={Styles.topButtons}>
          <Link href="/">
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
                            // onBlur={() => handleSave(widget.id)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter")
                                handleSaveWidgetName(widget.id);
                            }}
                            className={Styles.inlineInput}
                          />
                          <button
                            onClick={() => handleSaveWidgetName(widget.id)}
                            className={Styles.inlineSaveBtn}
                            title="Save"
                          >
                            ✅
                          </button>
                          <button
                            onClick={() => setEditingWidgetId(null)}
                            className={Styles.inlineCancelBtn}
                            title="Cancel"
                          >
                            ❌
                          </button>
                        </>
                      ) : (
                        <>
                          <div className={Styles.nameCell}>
                            <span>{widget.widget_name}</span>
                            <button
                              onClick={() => {
                                setEditingWidgetId(widget.id);
                                setEditedName(widget.widget_name);
                              }}
                              className={Styles.inlineEditBtn}
                              title="Edit name"
                            >
                              ✏️
                            </button>
                          </div>
                        </>
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
                        onClick={() => handleShowEmbedCode(widget)}
                        className={Styles.actionBtn}
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        Embed Code
                      </motion.button>
                      <motion.button
                        onClick={() => handleEdit(widget.id)}
                        className={Styles.actionBtn}
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
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

        <AnimatePresence>
          {isModalOpen && selectedWidget && (
            <Modal
              ariaHideApp={false}
              isOpen={isModalOpen}
              onRequestClose={() => setIsModalOpen(false)}
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
                      : "570px"
                  }; height: ${
                    selectedWidget.actualHeight || 400
                  }px; border: none;" loading="lazy"></iframe>`}
                  style={{ width: "100%", height: "100px", marginTop: "10px" }}
                />
                <motion.button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `<iframe src="http://localhost:3000/embed/${
                        selectedWidget.id
                      }" style="width: ${
                        selectedWidget.widthType === "pixels"
                          ? `${selectedWidget.widthPixels}px`
                          : "570px"
                      };height: ${
                        selectedWidget.actualHeight || 400
                      }px; border: none;" loading="lazy"></iframe>`
                    )
                  }
                  className={Styles.actionBtn}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Copy Code
                </motion.button>
                <motion.button
                  onClick={() => setIsModalOpen(false)}
                  className={Styles.actionBtn}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Close
                </motion.button>
              </motion.div>
            </Modal>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
