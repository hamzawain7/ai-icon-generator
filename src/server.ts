import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { generateIconSet, regenerateIconWithColor, PresetStyle, PRESET_STYLES } from './services/iconGenerator';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const clientBuildPath = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
}

interface GenerateIconsRequest {
  prompt: string;
  presetStyle: PresetStyle;
  brandColors?: string[];
}

interface ApiError extends Error {
  statusCode?: number;
}

app.get('/api/styles', (_req: Request, res: Response) => {
  res.json({
    styles: Object.entries(PRESET_STYLES).map(([key, value]) => ({
      id: key,
      name: value.name,
      description: value.description
    }))
  });
});

app.post('/api/generate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { prompt, presetStyle, brandColors } = req.body as GenerateIconsRequest;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({ error: 'Prompt is required and must be a non-empty string' });
    }

    if (!presetStyle || !PRESET_STYLES[presetStyle]) {
      return res.status(400).json({
        error: 'Invalid preset style',
        validStyles: Object.keys(PRESET_STYLES)
      });
    }

    if (brandColors && !Array.isArray(brandColors)) {
      return res.status(400).json({ error: 'Brand colors must be an array of hex color codes' });
    }

    if (brandColors) {
      const hexPattern = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      for (const color of brandColors) {
        if (!hexPattern.test(color)) {
          return res.status(400).json({ error: `Invalid hex color: ${color}` });
        }
      }
    }

    console.log(`Generating icons for prompt: "${prompt}", style: ${presetStyle}`);

    const icons = await generateIconSet(prompt.trim(), presetStyle, brandColors);

    res.json({
      success: true,
      prompt,
      style: PRESET_STYLES[presetStyle].name,
      icons
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/regenerate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { subject, presetStyle, color, index } = req.body;

    if (!subject || typeof subject !== 'string') {
      return res.status(400).json({ error: 'Subject is required' });
    }

    if (!presetStyle || !PRESET_STYLES[presetStyle as PresetStyle]) {
      return res.status(400).json({ error: 'Invalid preset style' });
    }

    if (!color || typeof color !== 'string') {
      return res.status(400).json({ error: 'Color is required' });
    }

    const hexPattern = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexPattern.test(color)) {
      return res.status(400).json({ error: `Invalid hex color: ${color}` });
    }

    console.log(`Regenerating icon for "${subject}" with color: ${color}`);

    const icon = await regenerateIconWithColor(subject, presetStyle as PresetStyle, color, index ?? 0);

    res.json({ success: true, icon });
  } catch (error) {
    next(error);
  }
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('*', (_req: Request, res: Response) => {
  const indexPath = path.join(clientBuildPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ error: 'Client not built. Run npm run build in /client' });
  }
});

app.use((err: ApiError, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err.message);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.listen(PORT, () => {
  console.log(`Icon Generator server running at http://localhost:${PORT}`);
  if (fs.existsSync(clientBuildPath)) {
    console.log(`Serving React client from ${clientBuildPath}`);
  } else {
    console.log(`React client not built. Run 'cd client && npm run build'`);
  }
});

export default app;
