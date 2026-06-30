import type { EffectParams } from '../types';

export function applyPatterns(
  ctx: CanvasRenderingContext2D,
  sourceCanvas: HTMLCanvasElement,
  params: EffectParams
): void {
  const width = sourceCanvas.width;
  const height = sourceCanvas.height;
  const sourceCtx = sourceCanvas.getContext('2d')!;

  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, width, height);

  const size = Math.max(2, params.ySquares);
  const angle = (params.gridAngle * Math.PI) / 180;

  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.rotate(angle);
  ctx.translate(-width / 2, -height / 2);

  for (let y = -height; y < height * 2; y += size) {
    for (let x = -width; x < width * 2; x += size) {
      const px = Math.floor(x);
      const py = Math.floor(y);
      if (px >= 0 && px < width && py >= 0 && py < height) {
        const pixel = sourceCtx.getImageData(px, py, 1, 1).data;
        const brightness = (pixel[0] + pixel[1] + pixel[2]) / 3;

        if (brightness < params.threshold) {
          ctx.fillStyle = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
          ctx.fillRect(x, y, size - 1, size - 1);
        }
      }
    }
  }
  ctx.restore();
}