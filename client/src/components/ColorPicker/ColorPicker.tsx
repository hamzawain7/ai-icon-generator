import type { BrandColor } from '../../types';
import { ColorInput } from './ColorInput';
import styles from './ColorPicker.module.css';

interface ColorPickerProps {
  colors: BrandColor[];
  onColorsChange: (colors: BrandColor[]) => void;
  disabled?: boolean;
}

export function ColorPicker({ 
  colors, 
  onColorsChange, 
  disabled 
}: ColorPickerProps) {
  const handleColorChange = (index: number, newColor: string) => {
    const updated = colors.map((c, i) =>
      i === index ? { ...c, value: newColor } : c
    );
    onColorsChange(updated);
  };

  const handleToggle = (index: number) => {
    const updated = colors.map((c, i) =>
      i === index ? { ...c, enabled: !c.enabled } : c
    );
    onColorsChange(updated);
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>
        <span className={styles.icon}>🎨</span>
        Custom Colors
        <span className={styles.optional}>Optional</span>
      </label>
      <div className={styles.inputs}>
        {colors.map((color, index) => (
          <ColorInput
            key={index}
            color={color.value}
            enabled={color.enabled}
            onColorChange={(newColor) => handleColorChange(index, newColor)}
            onToggle={() => handleToggle(index)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}
