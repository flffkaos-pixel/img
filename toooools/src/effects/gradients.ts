import type { EffectParams } from '../types';

export function applyGradients(
  ctx: CanvasRenderingContext2D,
  sourceCanvas: HTMLCanvasElement,
  params: EffectParams
): void {
  const width = sourceCanvas.width;
  const height = sourceCanvas.height;
  const sourceCtx = sourceCanvas.getContext('2d')!;
  const sourceData = sourceCtx.getImageData(0, 0, width, height).data;
  const outputData = ctx.createImageData(width, height);

  const numBands = Math.max(2, Math.floor(params.threshold / 20));

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const brightness = (sourceData[idx] + sourceData[idx + 1] + sourceData[idx + 2]) / 3;
      const band = Math.floor((brightness / 255) * numBands);
      const bandVal = (band / numBands) * 255;

      outputData.data[idx] = bandVal;
      outputData.data[idx + 1] = bandVal;
      outputData.data[idx + 2] = bandVal;
      outputData.data[idx + 3] = 255;
    }
  }

  ctx.putImageData(outputData, 0, 0);
}