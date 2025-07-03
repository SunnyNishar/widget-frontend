import React, { useState, useEffect } from "react";
import styles from "./WidgetCustomizer.module.css";

const WidgetCustomizer = ({ onSettingsChange }) => {
  const [fontStyle, setFontStyle] = useState("Arial");
  const [textAlign, setTextAlign] = useState("left");
  const [border, setBorder] = useState(false);
  const [borderColor, setBorderColor] = useState("#000000");

  // Send settings to parent whenever any of them changes
  useEffect(() => {
    onSettingsChange({
      fontStyle,
      textAlign,
      border,
      borderColor,
    });
  }, [fontStyle, textAlign, border, borderColor, onSettingsChange]);

  return (
    <div className={styles.container}>
      <div className={styles.formGroup}>
        <label>Font Style</label>
        <select
          value={fontStyle}
          onChange={(e) => setFontStyle(e.target.value)}
        >
          <option value="Arial">Arial</option>
          <option value="Georgia">Georgia</option>
          <option value="Courier New">Courier New</option>
          <option value="Verdana">Verdana</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label>Text Alignment</label>
        <div className={styles.alignment}>
          {["left", "center", "right"].map((align) => (
            <button
              key={align}
              className={`${styles.alignButton} ${
                textAlign === align ? styles.active : ""
              }`}
              onClick={() => setTextAlign(align)}
              type="button"
            >
              {align.charAt(0).toUpperCase() + align.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label>
          <input
            type="checkbox"
            checked={border}
            onChange={(e) => setBorder(e.target.checked)}
          />{" "}
          Add Border
        </label>
      </div>

      {border && (
        <div className={styles.formGroup}>
          <label>Border Color</label>
          <input
            type="color"
            value={borderColor}
            onChange={(e) => setBorderColor(e.target.value)}
          />
        </div>
      )}
    </div>
  );
};

export default WidgetCustomizer;
