import styles from './IconGrid.module.css';

export function LoadingSkeleton() {
  return (
    <div className={styles.card}>
      <div className={`${styles.imageContainer} ${styles.skeleton}`} />
    </div>
  );
}

