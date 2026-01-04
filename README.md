# DEMO: https://web-production-61afd.up.railway.app/

# Icon Forge - AI Icon Set Generator

A web application that generates consistent icon sets using AI. Built with a modular React + TypeScript frontend and Node.js + Express backend, powered by the Flux Schnell model via Replicate API.

## Features

- **Generate 4 Unique Icons** - Creates a set of 4 different icons that share a consistent visual style
- **5 Preset Styles**:
  - 🌸 **Pastels** - Soft, muted colors with gentle gradients
  - 🫧 **Bubbles** - Glossy, 3D bubble-like appearance
  - ◼️ **Flat Design** - Clean, modern with bold colors
  - 📦 **Isometric** - 3D isometric perspective
  - ✏️ **Hand Drawn** - Sketchy illustration style
- **Brand Colors** - Optional HEX color inputs to steer the palette
- **Downloadable** - Download individual PNGs or all at once

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, CSS Modules
- **Backend**: Node.js, Express, TypeScript
- **AI Model**: Flux Schnell via Replicate API

## Project Structure

```
├── src/                          # Backend source
│   ├── server.ts                 # Express server & API routes
│   └── services/
│       └── iconGenerator.ts      # Replicate API integration
├── client/                       # React frontend
│   └── src/
│       ├── components/           # UI components
│       │   ├── Header/
│       │   ├── PromptInput/
│       │   ├── StyleSelector/
│       │   ├── ColorPicker/
│       │   ├── GenerateButton/
│       │   ├── IconGrid/
│       │   ├── ErrorToast/
│       │   └── Footer/
│       ├── hooks/                # Custom React hooks
│       │   ├── useIconGenerator.ts
│       │   └── useDownload.ts
│       ├── services/             # API client
│       ├── types/                # TypeScript types
│       ├── constants/            # Style definitions
│       ├── App.tsx
│       └── main.tsx
├── package.json
└── tsconfig.json
```

## Setup & Running

### 1. Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client && npm install && cd ..
```

### 2. Set Environment Variables

Create a `.env` file in the root directory:

```env
REPLICATE_API_TOKEN=your_replicate_api_token_here
PORT=3000
```

### 3. Development Mode

Run both servers concurrently:

```bash
# Terminal 1: Backend
npm run dev

# Terminal 2: Frontend
cd client && npm run dev
```

- Frontend: http://localhost:5173 (with hot reload)
- Backend API: http://localhost:3000

### 4. Production Mode

```bash
# Build both
npm run build
cd client && npm run build && cd ..

# Start server (serves built React app)
npm start
```

The app will be available at http://localhost:3000

## API Endpoints

### `GET /api/styles`
Returns available preset styles.

### `POST /api/generate`
Generate an icon set.

**Request Body:**
```json
{
  "prompt": "Toys",
  "presetStyle": "pastels",
  "brandColors": ["#6366f1", "#ec4899"]
}
```

**Response:**
```json
{
  "success": true,
  "prompt": "Toys",
  "style": "Pastels",
  "icons": [
    { "id": 1, "url": "https://...", "prompt": "Toys" },
    { "id": 2, "url": "https://...", "prompt": "Toys" },
    { "id": 3, "url": "https://...", "prompt": "Toys" },
    { "id": 4, "url": "https://...", "prompt": "Toys" }
  ]
}
```

### `GET /api/health`
Health check endpoint.

## Architecture Decisions

### Modular Components
Each UI component is self-contained with its own styles (CSS Modules) and single responsibility:
- `PromptInput` - Text input with validation
- `StyleSelector` / `StyleCard` - Style selection grid
- `ColorPicker` / `ColorInput` - Brand color selection with toggles
- `IconGrid` / `IconCard` - Results display with downloads

### Custom Hooks
- `useIconGenerator` - Manages generation state and API calls
- `useDownload` - Handles file downloads

### Type Safety
Full TypeScript coverage with shared types for API contracts.

## Usage

1. Enter a prompt describing your icon theme (e.g., "Toys", "Food", "Travel")
2. Select a preset style
3. Optionally enable brand colors by clicking the checkmarks
4. Click "Generate Icon Set"
5. Download individual icons or all at once

## Notes

- Each generation creates 4 unique icons in parallel
- Icons are generated at 512x512 resolution
- Generation typically takes 10-30 seconds depending on API load
