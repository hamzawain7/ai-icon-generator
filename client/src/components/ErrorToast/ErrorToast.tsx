import { useEffect } from 'react';
import styles from './ErrorToast.module.css';

interface ErrorToastProps {
  message: string | null;
  onDismiss: () => void;
  autoHideDuration?: number;
}

export function ErrorToast({
  message,
  onDismiss,
  autoHideDuration = 5000,
}: ErrorToastProps) {
  useEffect(() => {
    if (message && autoHideDuration > 0) {
      const timer = setTimeout(onDismiss, autoHideDuration);
      return () => clearTimeout(timer);
    }
  }, [message, autoHideDuration, onDismiss]);

  if (!message) {
    return null;
  }

  return (
    <div className={styles.toast} role="alert">
      <span className={styles.icon}>⚠️</span>
      <span className={styles.message}>{message}</span>
      <button
        type="button"
        className={styles.close}
        onClick={onDismiss}
        aria-label="Dismiss error"
      >
        ×
      </button>
    </div>
  );
}

