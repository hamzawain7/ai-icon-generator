import { useCallback, useState } from 'react';

export type ImageFormat = 'png' | 'jpg';

interface UseDownloadReturn {
  isDownloading: boolean;
  downloadImage: (url: string, filename: string, format: ImageFormat) => Promise<void>;
  downloadAll: (urls: { url: string; filename: string }[], format: ImageFormat) => Promise<void>;
}

async function convertToJpg(blob: Blob): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (jpgBlob) => {
          if (jpgBlob) resolve(jpgBlob);
          else reject(new Error('Failed to convert to JPG'));
        },
        'image/jpeg',
        0.92
      );
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(blob);
  });
}

async function fetchAndDownload(url: string, filename: string, format: ImageFormat): Promise<void> {
  const response = await fetch(url);
  let blob = await response.blob();

  if (format === 'jpg') {
    blob = await convertToJpg(blob);
  }

  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename.replace(/\.\w+$/, `.${format}`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(blobUrl);
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function useDownload(): UseDownloadReturn {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadImage = useCallback(async (url: string, filename: string, format: ImageFormat) => {
    setIsDownloading(true);
    try {
      await fetchAndDownload(url, filename, format);
    } finally {
      setIsDownloading(false);
    }
  }, []);

  const downloadAll = useCallback(
    async (files: { url: string; filename: string }[], format: ImageFormat) => {
      setIsDownloading(true);
      try {
        for (const file of files) {
          await fetchAndDownload(file.url, file.filename, format);
          await delay(300);
        }
      } finally {
        setIsDownloading(false);
      }
    },
    []
  );

  return { isDownloading, downloadImage, downloadAll };
}
