import type { EffectParams } from '../types';

export function applyStack(
  ctx: CanvasRenderingContext2D,
  sourceCanvas: HTMLCanvasElement,
  params: EffectParams
): void {
  const width = sourceCanvas.width;
  const height = sourceCanvas.height;
  const sourceCtx = sourceCanvas.getContext('2d')!;
  const sourceData = sourceCtx.getImageData(0, 0, width, height).data;
  const outputData = ctx.createImageData(width, height);

  const layers = Math.max(2, Math.floor(params.ySquares / 5));
  const layerHeight = height / layers;

  for (let y = 0; y < height; y++) {
    const layerIdx = Math.floor(y / layerHeight);
    const layerOffset = layerIdx * 10;

    for (let x = 0; x < width; x++) {
      const srcX = (x + layerOffset) % width;
      const srcY = y;
      const srcIdx = (srcY * width + srcX) * 4;
      const dstIdx = (y * width + x) * 4;

      const brightness = (sourceData[srcIdx] + sourceData[srcIdx + 1] + sourceData[srcIdx + 2]) / 3;
      const layerBrightness = brightness * (1 - layerIdx * 0.1);

      outputData.data[dstIdx] = Math.max(0, Math.min(255, layerBrightness));
      outputData.data[dstIdx + 1] = Math.max(0, Math.min(255, layerBrightness));
      outputData.data[dstIdx + 2] = Math.max(0, Math.min(255, layerBrightness));
      outputData.data[dstIdx + 3] = 255;
    }
  }

  ctx.putImageData(outputData, 0, 0);
}