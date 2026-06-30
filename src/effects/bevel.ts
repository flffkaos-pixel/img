import type { EffectParams } from '../types';

export function applyBevel(
  ctx: CanvasRenderingContext2D,
  sourceCanvas: HTMLCanvasElement,
  params: EffectParams
): void {
  const width = sourceCanvas.width;
  const height = sourceCanvas.height;
  const sourceCtx = sourceCanvas.getContext('2d')!;
  const sourceData = sourceCtx.getImageData(0, 0, width, height).data;
  const outputData = ctx.createImageData(width, height);

  const depth = params.maxSquareWidth;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;

      const top = ((y - 1) * width + x) * 4;
      const bottom = ((y + 1) * width + x) * 4;
      const left = (y * width + (x - 1)) * 4;
      const right = (y * width + (x + 1)) * 4;

      const topBright = (sourceData[top] + sourceData[top + 1] + sourceData[top + 2]) / 3;
      const bottomBright = (sourceData[bottom] + sourceData[bottom + 1] + sourceData[bottom + 2]) / 3;
      const leftBright = (sourceData[left] + sourceData[left + 1] + sourceData[left + 2]) / 3;
      const rightBright = (sourceData[right] + sourceData[right + 1] + sourceData[right + 2]) / 3;

      const dx = (rightBright - leftBright) / 255;
      const dy = (bottomBright - topBright) / 255;

      const highlight = Math.max(0, dx + dy) * depth;
      const shadow = Math.max(0, -(dx + dy)) * depth;

      outputData.data[idx] = Math.min(255, sourceData[idx] + highlight - shadow);
      outputData.data[idx + 1] = Math.min(255, sourceData[idx + 1] + highlight - shadow);
      outputData.data[idx + 2] = Math.min(255, sourceData[idx + 2] + highlight - shadow);
      outputData.data[idx + 3] = 255;
    }
  }

  ctx.putImageData(outputData, 0, 0);
}