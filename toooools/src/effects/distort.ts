import type { EffectParams } from '../types';

export function applyDistort(
  ctx: CanvasRenderingContext2D,
  sourceCanvas: HTMLCanvasElement,
  params: EffectParams
): void {
  const width = sourceCanvas.width;
  const height = sourceCanvas.height;
  const sourceCtx = sourceCanvas.getContext('2d')!;
  const sourceData = sourceCtx.getImageData(0, 0, width, height).data;
  const outputData = ctx.createImageData(width, height);

  const amplitude = params.maxSquareWidth * 2;
  const frequency = 0.02 * params.threshold;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const distortX = x + Math.sin(y * frequency) * amplitude;
      const distortY = y + Math.cos(x * frequency) * amplitude;

      const srcX = Math.floor(distortX);
      const srcY = Math.floor(distortY);

      if (srcX >= 0 && srcX < width && srcY >= 0 && srcY < height) {
        const srcIdx = (srcY * width + srcX) * 4;
        const dstIdx = (y * width + x) * 4;
        outputData.data[dstIdx] = sourceData[srcIdx];
        outputData.data[dstIdx + 1] = sourceData[srcIdx + 1];
        outputData.data[dstIdx + 2] = sourceData[srcIdx + 2];
        outputData.data[dstIdx + 3] = 255;
      }
    }
  }

  ctx.putImageData(outputData, 0, 0);
}