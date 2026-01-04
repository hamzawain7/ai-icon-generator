import { useState, useCallback } from 'react';
import type { PresetStyleId, BrandColor } from './types';
import type { ImageFormat } from './hooks/useDownload';
import { DEFAULT_BRAND_COLORS } from './constants/styles';
import { useIconGenerator, useDownload } from './hooks';
import {
  PromptInput,
  StyleSelector,
  ColorPicker,
  GenerateButton,
  IconGrid,
  ErrorToast,
} from './components';
import './App.css';

export function App() {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<PresetStyleId>('flat');
  const [brandColors, setBrandColors] = useState<BrandColor[]>(DEFAULT_BRAND_COLORS);

  const { icons, status, error, regeneratingIndex, generate, updateIconColor, reset } = useIconGenerator();
  const { downloadImage, downloadAll } = useDownload();

  const isLoading = status === 'loading';

  const handleGenerate = useCallback(() => {
    if (!prompt.trim()) return;
    generate(prompt.trim(), selectedStyle, brandColors);
  }, [prompt, selectedStyle, brandColors, generate]);

  const handleDownload = useCallback(
    (url: string, filename: string, format: ImageFormat) => {
      downloadImage(url, filename, format);
    },
    [downloadImage]
  );

  const handleDownloadAll = useCallback((format: ImageFormat) => {
    const files = icons.map((icon, index) => ({
      url: icon.url,
      filename: `${prompt.toLowerCase().replace(/\s+/g, '-')}-icon-${index + 1}.${format}`,
    }));
    downloadAll(files, format);
  }, [icons, prompt, downloadAll]);

  const handleColorChange = useCallback((index: number, color: string) => {
    updateIconColor(index, color, selectedStyle);
  }, [updateIconColor, selectedStyle]);

  const handleDismissError = useCallback(() => {
    reset();
  }, [reset]);

  return (
    <div className="app-container">
      <div className="bg-decoration">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      <header className="app-header">
        <h1 className="app-title">Icon Generator</h1>
        <p className="app-author">
          by <span className="author-name">Hamza Wain</span>
          <span className="author-links">
            <a href="https://github.com/hamzawain7/ai-icon-generator" target="_blank" rel="noopener noreferrer" title="GitHub">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/hamzawain7/" target="_blank" rel="noopener noreferrer" title="LinkedIn">
              in
            </a>
            <a href="mailto:hamzawain7@gmail.com" title="Email">
              ✉
            </a>
          </span>
        </p>
      </header>

      <main className="main-content">
        <div className="generator-form">
          <PromptInput
            value={prompt}
            onChange={setPrompt}
            onSubmit={handleGenerate}
            disabled={isLoading}
          />

          <StyleSelector
            selectedStyle={selectedStyle}
            onStyleChange={setSelectedStyle}
            disabled={isLoading}
          />

          <ColorPicker
            colors={brandColors}
            onColorsChange={setBrandColors}
            disabled={isLoading}
          />

          <GenerateButton
            isLoading={isLoading}
            onClick={handleGenerate}
            disabled={!prompt.trim()}
          />
        </div>

        <IconGrid
          icons={icons}
          isLoading={isLoading}
          regeneratingIndex={regeneratingIndex}
          onDownload={handleDownload}
          onDownloadAll={handleDownloadAll}
          onColorChange={handleColorChange}
          prompt={prompt}
        />

        <ErrorToast message={error} onDismiss={handleDismissError} />
      </main>
    </div>
  );
}

export default App;
