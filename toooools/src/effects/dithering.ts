import type { EffectParams } from '../types';

export function applyDithering(
  ctx: CanvasRenderingContext2D,
  sourceCanvas: HTMLCanvasElement,
  params: EffectParams
): void {
  const width = sourceCanvas.width;
  const height = sourceCanvas.height;
  const sourceCtx = sourceCanvas.getContext('2d')!;
  const imageData = sourceCtx.getImageData(0, 0, width, height);
  const data = imageData.data;

  const grayscale = new Float32Array(width * height);
  for (let i = 0; i < width * height; i++) {
    grayscale[i] = (data[i * 4] + data[i * 4 + 1] + data[i * 4 + 2]) / 3;
  }

  const outputData = ctx.createImageData(width, height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const oldVal = grayscale[idx];
      const newVal = oldVal < params.threshold ? 0 : 255;
      const error = oldVal - newVal;

      grayscale[idx] = newVal;

      if (x + 1 < width) grayscale[idx + 1] += error * 7 / 16;
      if (y + 1 < height) {
        grayscale[(y + 1) * width + x] += error * 5 / 16;
        if (x > 0) grayscale[(y + 1) * width + x - 1] += error * 3 / 16;
        if (x + 1 < width) grayscale[(y + 1) * width + x + 1] += error * 1 / 16;
      }

      const outIdx = idx * 4;
      outputData.data[outIdx] = newVal;
      outputData.data[outIdx + 1] = newVal;
      outputData.data[outIdx + 2] = newVal;
      outputData.data[outIdx + 3] = 255;
    }
  }

  ctx.putImageData(outputData, 0, 0);
}