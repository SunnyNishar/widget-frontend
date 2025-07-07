"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/sidebar";
import Styles from "./mywidgets.module.css";
import Modal from "react-modal";
import Link from "next/link";

export default function MyWidgetsPage() {
  const [widgets, setWidgets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState(null);
  const router = useRouter();

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this widget?")) return;

    fetch("http://localhost/backend/deleteWidget.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setWidgets((prevWidgets) => prevWidgets.filter((w) => w.id !== id));
        } else {
          alert("Failed to delete widget.");
          console.error(data.error);
        }
      })
      .catch((err) => {
        alert("An error occurred while deleting.");
        console.error(err);
      });
  };

  const handleEdit = (widgetId) => {
    // Navigate to homepage with edit parameter
    router.push(`/?edit=${widgetId}`);
  };

  const handleShowEmbedCode = (widget) => {
    setSelectedWidget(widget);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetch("http://localhost/backend/getWidgets.php")
      .then((res) => res.json())
      .then((data) => setWidgets(data))
      .catch((err) => console.error("Failed to fetch widgets:", err));
  }, []);

  return (
    <div className={Styles.wrapper}>
      <Sidebar />
      <div className={Styles.main}>
        <h1 className={Styles.heading}>My Widgets</h1>
        <div className={Styles.topButtons}>
          <button className={Styles.createBtn}>
            <Link href="/">Create New Widget</Link>
          </button>
          <button className={Styles.learnBtn}>
            <a href="https://youtu.be/ea-ybXtsOCc" target="_blank">
              Learn More
            </a>
          </button>
        </div>
        <table className={Styles.table}>
          <thead>
            <tr>
              <th>Widget Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {widgets.map((widget) => (
              <tr key={widget.id}>
                <td>{widget.widget_name}</td>
                <td>
                  <button
                    className={Styles.actionBtn}
                    onClick={() => handleDelete(widget.id)}
                  >
                    Delete
                  </button>
                  <button
                    className={Styles.actionBtn}
                    onClick={() => handleShowEmbedCode(widget)}
                  >
                    Embed Code
                  </button>
                  <button
                    className={Styles.actionBtn}
                    onClick={() => handleEdit(widget.id)}
                  >
                    Edit Widget
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          contentLabel="Embed Code Modal"
          className={Styles.modalContent}
          overlayClassName={Styles.modalOverlay}
        >
          <div className={Styles.modalBox}>
            <h2>Embed Code</h2>
            <p>
              This is the embed code for widget: {selectedWidget?.widget_name}
            </p>
            <textarea
              readOnly
              value={
                selectedWidget
                  ? `<iframe src="http://localhost:3000/embed/${selectedWidget.id}" width="100%" height="400"></iframe>`
                  : ""
              }
              style={{ width: "100%", height: "100px", marginTop: "10px" }}
            />
            <button
              onClick={() => setIsModalOpen(false)}
              className={Styles.closeBtn}
            >
              Close
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
