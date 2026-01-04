import styles from './GenerateButton.module.css';

interface GenerateButtonProps {
  isLoading: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function GenerateButton({ 
  isLoading, 
  onClick, 
  disabled 
}: GenerateButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.button} ${isLoading ? styles.loading : ''}`}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      <span className={styles.text}>Generate Icon Set</span>
      <span className={styles.arrow}>→</span>
      <div className={styles.loader}>
        <div className={styles.dot} />
        <div className={styles.dot} />
        <div className={styles.dot} />
      </div>
    </button>
  );
}

