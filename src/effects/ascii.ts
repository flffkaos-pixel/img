import type { EffectParams } from '../types';

const ASCII_CHARS = ' .,:;i1tfLCG08@';

export function applyASCII(
  ctx: CanvasRenderingContext2D,
  sourceCanvas: HTMLCanvasElement,
  params: EffectParams
): void {
  const width = sourceCanvas.width;
  const height = sourceCanvas.height;
  const sourceCtx = sourceCanvas.getContext('2d')!;
  const sourceData = sourceCtx.getImageData(0, 0, width, height).data;

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);

  const fontSize = Math.max(4, Math.floor(params.ySquares / 2));
  ctx.font = `${fontSize}px monospace`;
  ctx.fillStyle = '#fff';
  ctx.textBaseline = 'top';

  const cellW = fontSize * 0.6;
  const cellH = fontSize;

  for (let y = 0; y < height; y += cellH) {
    for (let x = 0; x < width; x += cellW) {
      const px = Math.min(Math.floor(x), width - 1);
      const py = Math.min(Math.floor(y), height - 1);
      const idx = (py * width + px) * 4;
      const brightness = (sourceData[idx] + sourceData[idx + 1] + sourceData[idx + 2]) / 3;
      const charIdx = Math.floor(((255 - brightness) / 255) * (ASCII_CHARS.length - 1));
      ctx.fillText(ASCII_CHARS[charIdx], x, y);
    }
  }
}