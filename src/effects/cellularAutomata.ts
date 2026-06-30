import type { EffectParams } from '../types';

export function applyCellularAutomata(
  ctx: CanvasRenderingContext2D,
  sourceCanvas: HTMLCanvasElement,
  params: EffectParams
): void {
  const width = sourceCanvas.width;
  const height = sourceCanvas.height;
  const sourceCtx = sourceCanvas.getContext('2d')!;
  const sourceData = sourceCtx.getImageData(0, 0, width, height).data;

  const cellSize = Math.max(2, params.ySquares);
  const gridW = Math.ceil(width / cellSize);
  const gridH = Math.ceil(height / cellSize);

  let grid = new Uint8Array(gridW * gridH);
  for (let gy = 0; gy < gridH; gy++) {
    for (let gx = 0; gx < gridW; gx++) {
      const px = Math.min(gx * cellSize, width - 1);
      const py = Math.min(gy * cellSize, height - 1);
      const idx = (py * width + px) * 4;
      const brightness = (sourceData[idx] + sourceData[idx + 1] + sourceData[idx + 2]) / 3;
      grid[gy * gridW + gx] = brightness < params.threshold ? 1 : 0;
    }
  }

  const iterations = Math.max(1, Math.floor(params.maxSquareWidth / 3));
  for (let iter = 0; iter < iterations; iter++) {
    const newGrid = new Uint8Array(gridW * gridH);
    for (let gy = 0; gy < gridH; gy++) {
      for (let gx = 0; gx < gridW; gx++) {
        let neighbors = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const nx = (gx + dx + gridW) % gridW;
            const ny = (gy + dy + gridH) % gridH;
            neighbors += grid[ny * gridW + nx];
          }
        }

        const alive = grid[gy * gridW + gx];
        if (alive) {
          newGrid[gy * gridW + gx] = neighbors === 2 || neighbors === 3 ? 1 : 0;
        } else {
          newGrid[gy * gridW + gx] = neighbors === 3 ? 1 : 0;
        }
      }
    }
    grid = newGrid;
  }

  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, width, height);

  for (let gy = 0; gy < gridH; gy++) {
    for (let gx = 0; gx < gridW; gx++) {
      if (grid[gy * gridW + gx]) {
        const px = Math.min(gx * cellSize, width - 1);
        const py = Math.min(gy * cellSize, height - 1);
        const srcIdx = (py * width + px) * 4;
        ctx.fillStyle = `rgb(${sourceData[srcIdx]}, ${sourceData[srcIdx + 1]}, ${sourceData[srcIdx + 2]})`;
        ctx.fillRect(gx * cellSize, gy * cellSize, cellSize - 1, cellSize - 1);
      }
    }
  }
}