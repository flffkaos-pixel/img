import type { EffectName, EffectParams } from '../types';
import { applyStippling } from './stippling';
import { applyDots } from './dots';
import { applyPatterns } from './patterns';
import { applyEdge } from './edge';
import { applyDistort } from './distort';
import { applyDisplace } from './displace';
import { applyDithering } from './dithering';
import { applyBevel } from './bevel';
import { applyRecolor } from './recolor';
import { applyScatter } from './scatter';
import { applyCellularAutomata } from './cellularAutomata';
import { applyGradients } from './gradients';
import { applyCRT } from './crt';
import { applyASCII } from './ascii';
import { applySlide } from './slide';
import { applyStack } from './stack';

export type EffectFunction = (
  ctx: CanvasRenderingContext2D,
  sourceCanvas: HTMLCanvasElement,
  params: EffectParams
) => void;

const effects: Record<EffectName, EffectFunction> = {
  stippling: applyStippling,
  dots: applyDots,
  patterns: applyPatterns,
  edge: applyEdge,
  distort: applyDistort,
  displace: applyDisplace,
  dithering: applyDithering,
  bevel: applyBevel,
  recolor: applyRecolor,
  scatter: applyScatter,
  'cellular-automata': applyCellularAutomata,
  gradients: applyGradients,
  crt: applyCRT,
  ascii: applyASCII,
  slide: applySlide,
  stack: applyStack,
};

export function applyEffect(
  effectName: EffectName,
  ctx: CanvasRenderingContext2D,
  sourceCanvas: HTMLCanvasElement,
  params: EffectParams
): void {
  const effectFn = effects[effectName];
  if (effectFn) {
    effectFn(ctx, sourceCanvas, params);
  }
}

export { effects };