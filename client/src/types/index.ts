export type PresetStyleId = 
  | 'pastels' 
  | 'bubbles' 
  | 'flat' 
  | 'isometric' 
  | 'handDrawn';

export interface StyleOption {
  id: PresetStyleId;
  name: string;
  description: string;
  icon: string;
}

export interface GeneratedIcon {
  id: number;
  url: string;
  prompt: string;
}

export interface GenerateIconsRequest {
  prompt: string;
  presetStyle: PresetStyleId;
  brandColors?: string[];
}

export interface GenerateIconsResponse {
  success: boolean;
  prompt: string;
  style: string;
  icons: GeneratedIcon[];
}

export interface ApiError {
  error: string;
  validStyles?: string[];
}

export interface BrandColor {
  value: string;
  enabled: boolean;
}

export type GenerationStatus = 'idle' | 'loading' | 'success' | 'error';
