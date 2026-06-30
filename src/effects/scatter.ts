import type { EffectParams } from '../types';

export function applyScatter(
  ctx: CanvasRenderingContext2D,
  sourceCanvas: HTMLCanvasElement,
  params: EffectParams
): void {
  const width = sourceCanvas.width;
  const height = sourceCanvas.height;
  const sourceCtx = sourceCanvas.getContext('2d')!;
  const sourceData = sourceCtx.getImageData(0, 0, width, height).data;

  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, width, height);

  const density = Math.max(100, params.threshold * 20);
  const scatterAmount = params.maxSquareWidth * 3;

  for (let i = 0; i < density; i++) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    const idx = (y * width + x) * 4;

    const brightness = (sourceData[idx] + sourceData[idx + 1] + sourceData[idx + 2]) / 3;
    const size = ((255 - brightness) / 255) * params.maxSquareWidth;

    if (size > 0.5) {
      const scatterX = x + (Math.random() - 0.5) * scatterAmount;
      const scatterY = y + (Math.random() - 0.5) * scatterAmount;

      ctx.fillStyle = `rgb(${sourceData[idx]}, ${sourceData[idx + 1]}, ${sourceData[idx + 2]})`;
      ctx.beginPath();
      ctx.arc(scatterX, scatterY, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}