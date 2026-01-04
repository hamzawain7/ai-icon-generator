import type { StyleOption } from '../../types';
import styles from './StyleSelector.module.css';

interface StyleCardProps {
  style: StyleOption;
  isSelected: boolean;
  onSelect: (id: StyleOption['id']) => void;
  disabled?: boolean;
}

export function StyleCard({ 
  style, 
  isSelected, 
  onSelect, 
  disabled 
}: StyleCardProps) {
  const handleClick = () => {
    if (!disabled) {
      onSelect(style.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className={`${styles.card} ${isSelected ? styles.selected : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="radio"
      aria-checked={isSelected}
      tabIndex={disabled ? -1 : 0}
      data-disabled={disabled}
    >
      <span className={styles.cardIcon}>{style.icon}</span>
      <span className={styles.cardName}>{style.name}</span>
      <span className={styles.cardDesc}>{style.description}</span>
    </div>
  );
}

