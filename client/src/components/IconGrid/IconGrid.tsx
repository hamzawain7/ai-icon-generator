import { useState } from 'react';
import type { GeneratedIcon } from '../../types';
import type { ImageFormat } from '../../hooks/useDownload';
import { IconCard } from './IconCard';
import { LoadingSkeleton } from './LoadingSkeleton';
import styles from './IconGrid.module.css';

interface IconGridProps {
  icons: GeneratedIcon[];
  isLoading: boolean;
  regeneratingIndex: number | null;
  onDownload: (url: string, filename: string, format: ImageFormat) => void;
  onDownloadAll: (format: ImageFormat) => void;
  onColorChange: (index: number, color: string) => void;
  prompt: string;
}

export function IconGrid({
  icons,
  isLoading,
  regeneratingIndex,
  onDownload,
  onDownloadAll,
  onColorChange,
}: IconGridProps) {
  const [showFormatMenu, setShowFormatMenu] = useState(false);
  const showResults = isLoading || icons.length > 0;

  if (!showResults) {
    return null;
  }

  const handleDownloadAll = (format: ImageFormat) => {
    onDownloadAll(format);
    setShowFormatMenu(false);
  };

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Your Icons</h2>
        {icons.length > 0 && (
          <div className={styles.downloadAllWrapper}>
            <button
              type="button"
              className={styles.downloadAllBtn}
              onClick={() => setShowFormatMenu(!showFormatMenu)}
            >
              <span>Download All</span>
              <span className={styles.downloadIcon}>↓</span>
            </button>
            {showFormatMenu && (
              <div className={styles.formatMenu}>
                <button onClick={() => handleDownloadAll('png')}>PNG</button>
                <button onClick={() => handleDownloadAll('jpg')}>JPG</button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className={styles.grid}>
        {isLoading ? (
          <>
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />
          </>
        ) : (
          icons.map((icon, index) => (
            <IconCard
              key={icon.id}
              icon={icon}
              index={index}
              isRegenerating={regeneratingIndex === index}
              onDownload={onDownload}
              onColorChange={onColorChange}
            />
          ))
        )}
      </div>
    </section>
  );
}
