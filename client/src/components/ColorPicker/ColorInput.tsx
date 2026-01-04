import { useState, useEffect, type ChangeEvent } from 'react';
import styles from './ColorPicker.module.css';

interface ColorInputProps {
  color: string;
  enabled: boolean;
  onColorChange: (color: string) => void;
  onToggle: () => void;
  disabled?: boolean;
}

function isValidHex(value: string): boolean {
  return /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);
}

function normalizeHex(value: string): string {
  return value.startsWith('#') ? value : `#${value}`;
}

export function ColorInput({
  color,
  enabled,
  onColorChange,
  onToggle,
  disabled,
}: ColorInputProps) {
  const [hexValue, setHexValue] = useState(color);

  useEffect(() => {
    setHexValue(color);
  }, [color]);

  const handlePickerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setHexValue(newColor);
    onColorChange(newColor);
  };

  const handleHexChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHexValue(value);
    if (isValidHex(value)) {
      onColorChange(normalizeHex(value));
    }
  };

  return (
    <div className={styles.inputGroup}>
      <input
        type="color"
        className={styles.picker}
        value={color}
        onChange={handlePickerChange}
        disabled={disabled}
        aria-label="Color picker"
      />
      <input
        type="text"
        className={styles.hex}
        value={hexValue}
        onChange={handleHexChange}
        placeholder="#000000"
        maxLength={7}
        disabled={disabled}
        aria-label="Hex color code"
      />
      <button
        type="button"
        className={`${styles.toggle} ${enabled ? styles.active : ''}`}
        onClick={onToggle}
        disabled={disabled}
        aria-label={enabled ? 'Disable color' : 'Enable color'}
        aria-pressed={enabled}
      >
        <span className={styles.check}>✓</span>
      </button>
    </div>
  );
}
