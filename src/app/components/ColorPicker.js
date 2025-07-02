import React, { useState } from 'react';
import styles from './ColorPicker.module.css';

const ColorPicker = ({ onColorChange }) => {
  const [color, setColor] = useState('#000000');

  const handleChange = (e) => {
    const selectedColor = e.target.value;
    setColor(selectedColor);
    onColorChange(selectedColor);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>General Configurations</h1>
      <label className={styles.label}>Pick Text Color:</label>
      <input
        type="color"
        value={color}
        onChange={handleChange}
        className={styles.colorInput}
      />
    </div>
  );
};

export default ColorPicker;
