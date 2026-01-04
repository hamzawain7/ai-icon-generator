import type { StyleOption } from '../types';

export const PRESET_STYLES: StyleOption[] = [
  { id: 'flat', name: 'Flat', description: 'Bold & clean', icon: '◼️' },
  { id: 'pastels', name: 'Pastels', description: 'Soft & dreamy', icon: '🌸' },
  { id: 'bubbles', name: 'Bubbles', description: 'Glossy 3D', icon: '🫧' },
  { id: 'isometric', name: 'Isometric', description: '3D perspective', icon: '📦' },
  { id: 'handDrawn', name: 'Hand Drawn', description: 'Sketchy style', icon: '✏️' },
];

export const DEFAULT_BRAND_COLORS = [
  { value: '#6366f1', enabled: false },
  { value: '#ec4899', enabled: false },
  { value: '#10b981', enabled: false },
];
