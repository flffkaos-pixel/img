import type { EffectParams } from '../types';

export function applySlide(
  ctx: CanvasRenderingContext2D,
  sourceCanvas: HTMLCanvasElement,
  params: EffectParams
): void {
  const width = sourceCanvas.width;
  const height = sourceCanvas.height;
  const sourceCtx = sourceCanvas.getContext('2d')!;
  const sourceData = sourceCtx.getImageData(0, 0, width, height).data;
  const outputData = ctx.createImageData(width, height);

  const slices = Math.max(4, params.ySquares);
  const sliceHeight = height / slices;
  const offset = params.maxSquareWidth * 5;

  for (let y = 0; y < height; y++) {
    const sliceIdx = Math.floor(y / sliceHeight);
    const sliceOffset = sliceIdx % 2 === 0 ? offset : -offset;

    for (let x = 0; x < width; x++) {
      const srcX = (x + sliceOffset + width) % width;
      const srcIdx = (y * width + srcX) * 4;
      const dstIdx = (y * width + x) * 4;

      outputData.data[dstIdx] = sourceData[srcIdx];
      outputData.data[dstIdx + 1] = sourceData[srcIdx + 1];
      outputData.data[dstIdx + 2] = sourceData[srcIdx + 2];
      outputData.data[dstIdx + 3] = 255;
    }
  }

  ctx.putImageData(outputData, 0, 0);
}