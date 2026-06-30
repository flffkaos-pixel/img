import type { EffectParams } from '../types';

export function applyDisplace(
  ctx: CanvasRenderingContext2D,
  sourceCanvas: HTMLCanvasElement,
  params: EffectParams
): void {
  const width = sourceCanvas.width;
  const height = sourceCanvas.height;
  const sourceCtx = sourceCanvas.getContext('2d')!;
  const sourceData = sourceCtx.getImageData(0, 0, width, height).data;
  const outputData = ctx.createImageData(width, height);

  const scale = params.maxSquareWidth;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const brightness = (sourceData[idx] + sourceData[idx + 1] + sourceData[idx + 2]) / 3;
      const offset = ((brightness - 128) / 128) * scale;

      const srcX = Math.floor(x + offset);
      const srcY = Math.floor(y + offset * 0.5);

      if (srcX >= 0 && srcX < width && srcY >= 0 && srcY < height) {
        const srcIdx = (srcY * width + srcX) * 4;
        outputData.data[idx] = sourceData[srcIdx];
        outputData.data[idx + 1] = sourceData[srcIdx + 1];
        outputData.data[idx + 2] = sourceData[srcIdx + 2];
        outputData.data[idx + 3] = 255;
      }
    }
  }

  ctx.putImageData(outputData, 0, 0);
}