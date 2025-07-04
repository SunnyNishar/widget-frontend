"use client";
import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import Styles from "./mywidgets.module.css"; // create this CSS module
import Modal from "react-modal";

export default function MyWidgetsPage() {
  const [widgets, setWidgets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          <button className={Styles.createBtn}>Create New Widget</button>
          <button className={Styles.learnBtn}>Learn More</button>
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
                {/* <td>
                  <a
                    href={widget.feed_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {widget.feed_url.length > 40
                      ? widget.feed_url.slice(0, 40) + "..."
                      : widget.feed_url}
                  </a>
                </td> */}
                <td>
                  <button className={Styles.actionBtn}>Delete</button>
                  <button
                    className={Styles.actionBtn}
                    onClick={() => setIsModalOpen(true)}
                  >
                    Embed Code
                  </button>
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
                        This is the embed code you can use to integrate the
                        widget.
                      </p>
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className={Styles.closeBtn}
                      >
                        Close
                      </button>
                    </div>
                  </Modal>
                  <button className={Styles.actionBtn}>Edit Widget</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
