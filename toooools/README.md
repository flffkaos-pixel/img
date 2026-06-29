# Tooooools Clone

Image effects editor built with React + Vite + TypeScript + React Router.

## Features

- **Image Effects (14)**: Stippling, Dots, Patterns, Edge, Distort, Displace, Dithering, Bevel, Recolor, Scatter, Cellular Automata, Gradients, CRT, ASCII
- **Animation Effects (2)**: Slide, Stack
- **Image Preprocessing**: Blur, Grain, Gamma, Black/White Point
- **Separate pages** per effect (hash-free routing via React Router)
- **Export**: Download processed images as PNG
- **Keyboard Shortcuts**: Ctrl+O (upload), Ctrl+S (export)

## Development

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deploy to Cloudflare Pages

This project lives in the `toooools/` subfolder of the `img` repo.

**Via Cloudflare Dashboard (recommended):**
1. Go to Cloudflare Dashboard → Pages → Create a project
2. Connect `github.com/flffkaos-pixel/img`
3. Configure:
   - **Root directory**: `toooools`
   - **Build command**: `npm install && npm run build`
   - **Build output directory**: `dist`

**Via Wrangler CLI:**
```bash
cd toooools
npm install -g wrangler
wrangler login
wrangler pages deploy dist --project-name toooools
```

## Tech Stack

- React 19 + React Router 7
- Vite 8
- TypeScript 6
- Canvas API for image processing