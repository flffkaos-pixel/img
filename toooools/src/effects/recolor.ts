import type { EffectParams } from '../types';

export function applyRecolor(
  ctx: CanvasRenderingContext2D,
  sourceCanvas: HTMLCanvasElement,
  params: EffectParams
): void {
  const width = sourceCanvas.width;
  const height = sourceCanvas.height;
  const sourceCtx = sourceCanvas.getContext('2d')!;
  const sourceData = sourceCtx.getImageData(0, 0, width, height).data;
  const outputData = ctx.createImageData(width, height);

  const hueShift = params.gridAngle;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      let r = sourceData[idx];
      let g = sourceData[idx + 1];
      let b = sourceData[idx + 2];

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const l = (max + min) / 2 / 255;

      if (max !== min) {
        const d = (max - min) / 255;
        let h = 0;
        const s = l > 0.5 ? d / (2 - max / 255 - min / 255) : d / (max / 255 + min / 255);

        if (r === max) h = ((g - b) / 255 / d + (g < b ? 6 : 0)) / 6;
        else if (g === max) h = ((b - r) / 255 / d + 2) / 6;
        else h = ((r - g) / 255 / d + 4) / 6;

        h = (h + hueShift / 360) % 1;
        if (h < 0) h += 1;

        const hue2rgb = (p: number, q: number, t: number) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        };

        const q2 = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p2 = 2 * l - q2;
        r = hue2rgb(p2, q2, h + 1 / 3) * 255;
        g = hue2rgb(p2, q2, h) * 255;
        b = hue2rgb(p2, q2, h - 1 / 3) * 255;
      }

      outputData.data[idx] = Math.max(0, Math.min(255, r));
      outputData.data[idx + 1] = Math.max(0, Math.min(255, g));
      outputData.data[idx + 2] = Math.max(0, Math.min(255, b));
      outputData.data[idx + 3] = 255;
    }
  }

  ctx.putImageData(outputData, 0, 0);
}