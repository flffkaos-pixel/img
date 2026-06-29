import type { EffectParams } from '../types';

export function applyStippling(
  ctx: CanvasRenderingContext2D,
  sourceCanvas: HTMLCanvasElement,
  params: EffectParams
): void {
  const width = sourceCanvas.width;
  const height = sourceCanvas.height;
  const sourceCtx = sourceCanvas.getContext('2d')!;

  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, width, height);

  const step = Math.max(2, Math.floor(32 - params.threshold / 8));

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const pixel = sourceCtx.getImageData(x, y, 1, 1).data;
      const brightness = (pixel[0] + pixel[1] + pixel[2]) / 3;
      const darkness = 255 - brightness;

      if (darkness > 10) {
        const radius = (darkness / 255) * (step / 2) * (params.maxSquareWidth / 10);
        ctx.fillStyle = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
        ctx.beginPath();
        ctx.arc(x, y, Math.max(0.5, radius), 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}