import type { EffectParams } from '../types';

export function applyEdge(
  ctx: CanvasRenderingContext2D,
  sourceCanvas: HTMLCanvasElement,
  params: EffectParams
): void {
  const width = sourceCanvas.width;
  const height = sourceCanvas.height;
  const sourceCtx = sourceCanvas.getContext('2d')!;
  const sourceData = sourceCtx.getImageData(0, 0, width, height).data;
  const outputData = ctx.createImageData(width, height);

  const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
  const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let gx = 0, gy = 0;

      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const idx = ((y + ky) * width + (x + kx)) * 4;
          const brightness = (sourceData[idx] + sourceData[idx + 1] + sourceData[idx + 2]) / 3;
          const ki = (ky + 1) * 3 + (kx + 1);
          gx += brightness * sobelX[ki];
          gy += brightness * sobelY[ki];
        }
      }

      const magnitude = Math.sqrt(gx * gx + gy * gy);
      const idx = (y * width + x) * 4;
      const val = magnitude > params.threshold ? 255 : 0;
      outputData.data[idx] = val;
      outputData.data[idx + 1] = val;
      outputData.data[idx + 2] = val;
      outputData.data[idx + 3] = 255;
    }
  }

  ctx.putImageData(outputData, 0, 0);
}