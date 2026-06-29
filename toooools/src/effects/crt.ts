import type { EffectParams } from '../types';

export function applyCRT(
  ctx: CanvasRenderingContext2D,
  sourceCanvas: HTMLCanvasElement,
  params: EffectParams
): void {
  const width = sourceCanvas.width;
  const height = sourceCanvas.height;
  const sourceCtx = sourceCanvas.getContext('2d')!;
  const sourceData = sourceCtx.getImageData(0, 0, width, height).data;
  const outputData = ctx.createImageData(width, height);

  const scanlineIntensity = params.maxSquareWidth / 20;
  const curvature = params.threshold / 500;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cx = (x / width - 0.5) * 2;
      const cy = (y / height - 0.5) * 2;

      const dx = cx * (1 + curvature * cy * cy);
      const dy = cy * (1 + curvature * cx * cx);

      const srcX = Math.floor(((dx + 1) / 2) * width);
      const srcY = Math.floor(((dy + 1) / 2) * height);

      const dstIdx = (y * width + x) * 4;

      if (srcX >= 0 && srcX < width && srcY >= 0 && srcY < height) {
        const srcIdx = (srcY * width + srcX) * 4;
        const scanline = Math.sin(y * 0.5) * scanlineIntensity;

        outputData.data[dstIdx] = Math.max(0, Math.min(255, sourceData[srcIdx] + scanline));
        outputData.data[dstIdx + 1] = Math.max(0, Math.min(255, sourceData[srcIdx + 1] + scanline));
        outputData.data[dstIdx + 2] = Math.max(0, Math.min(255, sourceData[srcIdx + 2] + scanline));
        outputData.data[dstIdx + 3] = 255;
      }
    }
  }

  for (let y = 0; y < height; y += 3) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      outputData.data[idx] *= 0.7;
      outputData.data[idx + 1] *= 0.7;
      outputData.data[idx + 2] *= 0.7;
    }
  }

  ctx.putImageData(outputData, 0, 0);
}