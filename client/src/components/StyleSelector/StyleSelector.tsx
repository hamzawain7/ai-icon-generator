import type { PresetStyleId } from '../../types';
import { PRESET_STYLES } from '../../constants/styles';
import { StyleCard } from './StyleCard';
import styles from './StyleSelector.module.css';

interface StyleSelectorProps {
  selectedStyle: PresetStyleId;
  onStyleChange: (style: PresetStyleId) => void;
  disabled?: boolean;
}

export function StyleSelector({ 
  selectedStyle, 
  onStyleChange, 
  disabled 
}: StyleSelectorProps) {
  return (
    <div className={styles.container}>
      <label className={styles.label}>
        <span className={styles.icon}>🎨</span>
        Choose a Style
      </label>
      <div className={styles.grid} role="radiogroup" aria-label="Icon style">
        {PRESET_STYLES.map((style) => (
          <StyleCard
            key={style.id}
            style={style}
            isSelected={selectedStyle === style.id}
            onSelect={onStyleChange}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}

