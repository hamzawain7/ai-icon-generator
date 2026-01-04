import type { ChangeEvent, KeyboardEvent } from 'react';
import styles from './PromptInput.module.css';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  disabled?: boolean;
}

export function PromptInput({ value, onChange, onSubmit, disabled }: PromptInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSubmit && value.trim()) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className={styles.container}>
      <label htmlFor="prompt" className={styles.label}>
        <span className={styles.icon}>💡</span>
        What icons do you need?
      </label>
      <input
        type="text"
        id="prompt"
        className={styles.input}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="e.g., Toys, Food, Travel, Technology..."
        disabled={disabled}
        autoComplete="off"
        autoFocus
      />
    </div>
  );
}
