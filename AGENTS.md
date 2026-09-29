<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project: Tur Virtual 360° Perpustakaan Kominfo

## Overview

Website tur virtual reality 360° untuk perpustakaan Kominfo, dibangun dengan Next.js 16 dan Pannellum.js sebagai panorama viewer.

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.3.4 |
| UI | React | 19.2.8 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS | v4 |
| Panorama Viewer | Pannellum | latest (npm) |

## Project Structure

```
tur-virtual-360-kominfo-perpustakaan/
├── app/
│   ├── components/
│   │   ├── PannellumViewer.tsx      # Client-side wrapper Pannellum
│   │   ├── SceneInfo.tsx            # Panel info ruangan (modern card)
│   │   └── NavigationSidebar.tsx    # Sidebar navigasi daftar ruangan
│   ├── configs/
│   │   └── tourData.ts             # Data konfigurasi tour (scenes, hotspots)
│   ├── hooks/
│   │   └── usePannellum.ts         # Custom hook untuk Pannellum API
│   ├── utils/
│   │   └── tourHelpers.ts          # Utility functions
│   ├── page.tsx                    # Halaman utama tour
│   ├── layout.tsx                  # Root layout
│   └── globals.css                 # Custom styles + Tailwind
├── public/
│   ├── images/
│   │   └── panoramas/              # Gambar 360° equirectangular
│   └── placeholder.svg             # Placeholder untuk gambar
├── package.json
└── tsconfig.json
```

## Implementation Steps

### Step 1: Install Dependencies
```bash
npm install pannellum
```

### Step 2: Tour Data Configuration (`app/configs/tourData.ts`)

```typescript
export interface HotSpot {
  pitch: number;
  yaw: number;
  type: "scene" | "info";
  text: string;
  sceneId?: string;
  URL?: string;
  targetPitch?: number | "same";
  targetYaw?: number | "same" | "sameAzimuth";
  targetHfov?: number | "same";
}

export interface Scene {
  title: string;
  hfov: number;
  pitch: number;
  yaw: number;
  type: "equirectangular";
  panorama: string;
  hotSpots: HotSpot[];
}

export interface TourConfig {
  default: {
    firstScene: string;
    sceneFadeDuration: number;
    author?: string;
  };
  scenes: Record<string, Scene>;
}

export const tourData: TourConfig = {
  default: {
    firstScene: "lobby",
    sceneFadeDuration: 1000,
    author: "Kominfo",
  },
  scenes: {
    lobby: {
      title: "Lobi Utama",
      hfov: 110,
      pitch: -3,
      yaw: 117,
      type: "equirectangular",
      panorama: "/images/panoramas/lobby.jpg",
      hotSpots: [
        {
          pitch: -2.1,
          yaw: 132.9,
          type: "scene",
          text: "Ruang Baca",
          sceneId: "reading_room",
          targetPitch: 2,
          targetYaw: -23,
        },
        {
          pitch: 0,
          yaw: 45,
          type: "info",
          text: "Lobi Utama Perpustakaan",
          URL: "#",
        },
      ],
    },
    // ... tambahkan scene lainnya
  },
};
```

### Step 3: Pannellum Viewer Component (`app/components/PannellumViewer.tsx`)

- Client component ("use client")
- Dynamic import (SSR-safe)
- Wrapper untuk Pannellum API
- Event handlers: scenechange, load, error

### Step 4: Scene Info Component (`app/components/SceneInfo.tsx`)

- Modern card UI
- Menampilkan judul ruangan, deskripsi, hotspots info
- Responsive design

### Step 5: Navigation Sidebar (`app/components/NavigationSidebar.tsx`)

- Daftar semua ruangan
- Status aktif untuk ruangan saat ini
- Thumbnail preview
- Klik untuk navigasi ke ruangan

### Step 6: Main Page (`app/page.tsx`)

- Layout: sidebar kiri + viewer utama
- State management: currentScene
- Integrasi semua komponen

### Step 7: Custom Styles (`app/globals.css`)

- Pannellum container styles
- Custom hotspot styles
- Sidebar animations
- Responsive breakpoints

## Pannellum Configuration Reference

### Key Options
- `type`: "equirectangular" | "cubemap" | "multires"
- `panorama`: URL gambar equirectangular
- `hfov`: Horizontal field of view (default: 100)
- `pitch`: Starting pitch in degrees
- `yaw`: Starting yaw in degrees
- `autoLoad`: Auto load panorama (default: false)
- `autoRotate`: Rotation speed in degrees/sec
- `sceneFadeDuration`: Fade animation between scenes (ms)

### HotSpot Options
- `pitch`: Vertical position (-90 to 90)
- `yaw`: Horizontal position (-180 to 180)
- `type`: "scene" (navigasi) | "info" (informasi)
- `text`: Tooltip text
- `sceneId`: Target scene ID (for scene hotspots)
- `URL`: External link (for info hotspots)

### API Events
- `load`: Panorama loaded
- `scenechange`: Scene change initiated
- `fullscreenchange`: Fullscreen toggled
- `zoomchange`: Zoom level changed

## Notes

- Project purpose: Virtual tour perpustakaan untuk KKN Kominfo
- Jumlah scene: 10+ ruangan
- Gambar 360°: Sebagian sudah ada, sebagian perlu placeholder
- Gunakan placeholder SVG untuk gambar yang belum tersedia
- Semua komponen Pannellum harus client-side (dynamic import)
