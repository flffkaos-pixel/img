export interface EffectParams {
  threshold: number;
  gridType: 'Regular' | 'Benday';
  gridAngle: number;
  ySquares: number;
  xSquares: number;
  minSquareWidth: number;
  maxSquareWidth: number;
  blur: number;
  grain: number;
  gamma: number;
  blackPoint: number;
  whitePoint: number;
  showEffect: boolean;
}

export interface PreprocessingParams {
  blur: number;
  grain: number;
  gamma: number;
  blackPoint: number;
  whitePoint: number;
}

export interface CanvasSize {
  width: number;
  height: number;
}

export type EffectName =
  | 'stippling'
  | 'dots'
  | 'patterns'
  | 'edge'
  | 'distort'
  | 'displace'
  | 'dithering'
  | 'bevel'
  | 'recolor'
  | 'scatter'
  | 'cellular-automata'
  | 'gradients'
  | 'crt'
  | 'ascii'
  | 'slide'
  | 'stack';

export interface EffectConfig {
  name: EffectName;
  label: string;
  category: 'effects' | 'animate';
}

export const EFFECTS: EffectConfig[] = [
  { name: 'stippling', label: 'Stippling', category: 'effects' },
  { name: 'dots', label: 'Dots', category: 'effects' },
  { name: 'patterns', label: 'Patterns', category: 'effects' },
  { name: 'edge', label: 'Edge', category: 'effects' },
  { name: 'distort', label: 'Distort', category: 'effects' },
  { name: 'displace', label: 'Displace', category: 'effects' },
  { name: 'dithering', label: 'Dithering', category: 'effects' },
  { name: 'bevel', label: 'Bevel', category: 'effects' },
  { name: 'recolor', label: 'Recolor', category: 'effects' },
  { name: 'scatter', label: 'Scatter', category: 'effects' },
  { name: 'cellular-automata', label: 'Cellular Automata', category: 'effects' },
  { name: 'gradients', label: 'Gradients', category: 'effects' },
  { name: 'crt', label: 'CRT', category: 'effects' },
  { name: 'ascii', label: 'ASCII', category: 'effects' },
  { name: 'slide', label: 'Slide', category: 'animate' },
  { name: 'stack', label: 'Stack', category: 'animate' },
];

export const DEFAULT_EFFECT_PARAMS: EffectParams = {
  threshold: 128,
  gridType: 'Regular',
  gridAngle: 0,
  ySquares: 20,
  xSquares: 20,
  minSquareWidth: 2,
  maxSquareWidth: 20,
  blur: 0,
  grain: 0,
  gamma: 1,
  blackPoint: 0,
  whitePoint: 255,
  showEffect: true,
};