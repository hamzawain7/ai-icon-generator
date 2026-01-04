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
