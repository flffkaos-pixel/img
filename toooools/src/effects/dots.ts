import type { EffectParams } from '../types';

export function applyDots(
  ctx: CanvasRenderingContext2D,
  sourceCanvas: HTMLCanvasElement,
  params: EffectParams
): void {
  const width = sourceCanvas.width;
  const height = sourceCanvas.height;
  const sourceCtx = sourceCanvas.getContext('2d')!;

  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, width, height);

  const gridX = params.xSquares;
  const gridY = params.ySquares;
  const cellW = width / gridX;
  const cellH = height / gridY;

  for (let gy = 0; gy < gridY; gy++) {
    for (let gx = 0; gx < gridX; gx++) {
      const cx = gx * cellW + cellW / 2;
      const cy = gy * cellH + cellH / 2;
      const px = Math.floor(cx);
      const py = Math.floor(cy);
      const pixel = sourceCtx.getImageData(
        Math.min(px, width - 1),
        Math.min(py, height - 1),
        1, 1
      ).data;
      const brightness = (pixel[0] + pixel[1] + pixel[2]) / 3;
      const radius = ((255 - brightness) / 255) * (Math.min(cellW, cellH) / 2) * (params.maxSquareWidth / 10);

      if (radius > 0.5) {
        ctx.fillStyle = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}