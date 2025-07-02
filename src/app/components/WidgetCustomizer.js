import React, { useState } from 'react';
import styles from './WidgetCustomizer.module.css';

const WidgetCustomizer = ({ onSettingsChange }) => {
  const [fontStyle, setFontStyle] = useState('Arial');
  const [textAlign, setTextAlign] = useState('left');
  const [border, setBorder] = useState(false);
  const [borderColor, setBorderColor] = useState('#000000');

  const handleChange = () => {
    onSettingsChange({
      fontStyle,
      textAlign,
      border,
      borderColor,
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.formGroup}>
        <label>Font Style</label>
        <select
          value={fontStyle}
          onChange={(e) => {
            setFontStyle(e.target.value);
            handleChange();
          }}
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
          {['left', 'center', 'right'].map((align) => (
            <button
              key={align}
              className={`${styles.alignButton} ${textAlign === align ? styles.active : ''}`}
              onClick={() => {
                setTextAlign(align);
                handleChange();
              }}
            >
              {align.charAt(0) + align.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label>
          <input
            type="checkbox"
            checked={border}
            onChange={(e) => {
              setBorder(e.target.checked);
              handleChange();
            }}
          />
           Add Border
        </label>
      </div>

      {border && (
        <div className={styles.formGroup}>
          <label>Border Color</label>
          <input
            type="color"
            value={borderColor}
            onChange={(e) => {
              setBorderColor(e.target.value);
              handleChange();
            }}
          />
        </div>
      )}
    </div>
  );
};

export default WidgetCustomizer;
