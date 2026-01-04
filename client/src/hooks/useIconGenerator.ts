import { useState, useCallback } from 'react';
import type { 
  GeneratedIcon, 
  PresetStyleId, 
  GenerationStatus,
  BrandColor 
} from '../types';
import { generateIcons, regenerateIcon } from '../services/api';

interface UseIconGeneratorReturn {
  icons: GeneratedIcon[];
  status: GenerationStatus;
  error: string | null;
  styleName: string | null;
  regeneratingIndex: number | null;
  generate: (prompt: string, style: PresetStyleId, colors: BrandColor[]) => Promise<void>;
  updateIconColor: (index: number, color: string, style: PresetStyleId) => Promise<void>;
  reset: () => void;
}

export function useIconGenerator(): UseIconGeneratorReturn {
  const [icons, setIcons] = useState<GeneratedIcon[]>([]);
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [styleName, setStyleName] = useState<string | null>(null);
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null);

  const generate = useCallback(
    async (prompt: string, style: PresetStyleId, colors: BrandColor[]) => {
      setStatus('loading');
      setError(null);
      setIcons([]);

      try {
        const enabledColors = colors.filter((c) => c.enabled).map((c) => c.value);
        const response = await generateIcons({
          prompt,
          presetStyle: style,
          brandColors: enabledColors.length > 0 ? enabledColors : undefined,
        });

        setIcons(response.icons);
        setStyleName(response.style);
        setStatus('success');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(message);
        setStatus('error');
      }
    },
    []
  );

  const updateIconColor = useCallback(
    async (index: number, color: string, style: PresetStyleId) => {
      const icon = icons[index];
      if (!icon) return;

      setRegeneratingIndex(index);
      setError(null);

      try {
        const newIcon = await regenerateIcon(icon.prompt, style, color, index);
        setIcons(prev => prev.map((ic, i) => i === index ? { ...newIcon, id: ic.id } : ic));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update icon color';
        setError(message);
      } finally {
        setRegeneratingIndex(null);
      }
    },
    [icons]
  );

  const reset = useCallback(() => {
    setIcons([]);
    setStatus('idle');
    setError(null);
    setStyleName(null);
    setRegeneratingIndex(null);
  }, []);

  return { icons, status, error, styleName, regeneratingIndex, generate, updateIconColor, reset };
}
