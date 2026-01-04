import { useState, type ChangeEvent } from 'react';
import type { GeneratedIcon } from '../../types';
import type { ImageFormat } from '../../hooks/useDownload';
import styles from './IconGrid.module.css';

interface IconCardProps {
  icon: GeneratedIcon;
  index: number;
  isRegenerating: boolean;
  onDownload: (url: string, filename: string, format: ImageFormat) => void;
  onColorChange: (index: number, color: string) => void;
}

export function IconCard({ icon, index, isRegenerating, onDownload, onColorChange }: IconCardProps) {
  const [selectedColor, setSelectedColor] = useState('#6366f1');

  const handleDownload = (format: ImageFormat) => {
    onDownload(icon.url, `icon-${index + 1}.${format}`, format);
  };

  const handleColorSelect = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedColor(e.target.value);
  };

  const handleApplyColor = () => {
    onColorChange(index, selectedColor);
  };

  return (
    <article className={`${styles.card} ${isRegenerating ? styles.regenerating : ''}`}>
      <div className={styles.imageContainer}>
        {isRegenerating && (
          <div className={styles.regeneratingOverlay}>
            <div className={styles.spinner} />
          </div>
        )}
        <img
          src={icon.url}
          alt={`Generated icon ${index + 1}`}
          className={styles.image}
          loading="lazy"
        />
        <div className={styles.overlay}>
          <div className={styles.cardActions}>
            <div className={styles.colorAction}>
              <input
                type="color"
                className={styles.colorPicker}
                value={selectedColor}
                onChange={handleColorSelect}
                title="Pick a color"
              />
              <button
                type="button"
                className={styles.applyColorBtn}
                onClick={handleApplyColor}
                disabled={isRegenerating}
              >
                Recolor
              </button>
            </div>
            <div className={styles.downloadButtons}>
              <button
                type="button"
                className={styles.downloadBtn}
                onClick={() => handleDownload('png')}
              >
                PNG
              </button>
              <button
                type="button"
                className={styles.downloadBtn}
                onClick={() => handleDownload('jpg')}
              >
                JPG
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
