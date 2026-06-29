import type { PreprocessingParams } from '../types';

export function preprocessImage(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: PreprocessingParams
): void {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    if (params.gamma !== 1) {
      r = 255 * Math.pow(r / 255, 1 / params.gamma);
      g = 255 * Math.pow(g / 255, 1 / params.gamma);
      b = 255 * Math.pow(b / 255, 1 / params.gamma);
    }

    r = Math.max(params.blackPoint, Math.min(params.whitePoint, r));
    g = Math.max(params.blackPoint, Math.min(params.whitePoint, g));
    b = Math.max(params.blackPoint, Math.min(params.whitePoint, b));

    r = ((r - params.blackPoint) / (params.whitePoint - params.blackPoint)) * 255;
    g = ((g - params.blackPoint) / (params.whitePoint - params.blackPoint)) * 255;
    b = ((b - params.blackPoint) / (params.whitePoint - params.blackPoint)) * 255;

    if (params.grain > 0) {
      const noise = (Math.random() - 0.5) * params.grain;
      r += noise;
      g += noise;
      b += noise;
    }

    data[i] = Math.max(0, Math.min(255, r));
    data[i + 1] = Math.max(0, Math.min(255, g));
    data[i + 2] = Math.max(0, Math.min(255, b));
  }

  ctx.putImageData(imageData, 0, 0);
}

export function getPixelBrightness(r: number, g: number, b: number): number {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

export function getGrayscale(ctx: CanvasRenderingContext2D, x: number, y: number): number {
  const pixel = ctx.getImageData(x, y, 1, 1).data;
  return getPixelBrightness(pixel[0], pixel[1], pixel[2]);
}