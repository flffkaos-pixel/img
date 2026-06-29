# Tooooools Clone

Image effects editor built with React + Vite + TypeScript.

## Features

- **Image Effects**: Stippling, Dots, Patterns, Edge, Distort, Displace, Dithering, Bevel, Recolor, Scatter, Cellular Automata, Gradients, CRT, ASCII
- **Animation Effects**: Slide, Stack
- **Image Preprocessing**: Blur, Grain, Gamma, Black/White Point
- **Export**: Download processed images as PNG
- **Keyboard Shortcuts**: Ctrl+O (upload), Ctrl+S (export)

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deploy to Cloudflare Pages

1. Install Wrangler CLI:
   ```bash
   npm install -g wrangler
   ```

2. Login to Cloudflare:
   ```bash
   wrangler login
   ```

3. Deploy:
   ```bash
   npm run deploy:ci
   ```

Or connect your GitHub repository to Cloudflare Pages for automatic deployments.

## Tech Stack

- React 19
- Vite 8
- TypeScript 6
- Canvas API for image processing