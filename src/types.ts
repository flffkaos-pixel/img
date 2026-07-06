export interface EffectParams {
  threshold: number;
  gridAngle: number;
  ySquares: number;
  xSquares: number;
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
  params: string[];
}

export const EFFECTS: EffectConfig[] = [
  { name: 'stippling', label: 'Stippling', category: 'effects', params: ['threshold', 'maxSquareWidth'] },
  { name: 'dots', label: 'Dots', category: 'effects', params: ['xSquares', 'ySquares', 'maxSquareWidth'] },
  { name: 'patterns', label: 'Patterns', category: 'effects', params: ['ySquares', 'gridAngle', 'threshold'] },
  { name: 'edge', label: 'Edge', category: 'effects', params: ['threshold'] },
  { name: 'distort', label: 'Distort', category: 'effects', params: ['maxSquareWidth', 'threshold'] },
  { name: 'displace', label: 'Displace', category: 'effects', params: ['maxSquareWidth'] },
  { name: 'dithering', label: 'Dithering', category: 'effects', params: ['threshold'] },
  { name: 'bevel', label: 'Bevel', category: 'effects', params: ['maxSquareWidth'] },
  { name: 'recolor', label: 'Recolor', category: 'effects', params: ['gridAngle'] },
  { name: 'scatter', label: 'Scatter', category: 'effects', params: ['threshold', 'maxSquareWidth'] },
  { name: 'cellular-automata', label: 'Cellular Automata', category: 'effects', params: ['ySquares', 'threshold', 'maxSquareWidth'] },
  { name: 'gradients', label: 'Gradients', category: 'effects', params: ['threshold'] },
  { name: 'crt', label: 'CRT', category: 'effects', params: ['maxSquareWidth', 'threshold'] },
  { name: 'ascii', label: 'ASCII', category: 'effects', params: ['ySquares'] },
  { name: 'slide', label: 'Slide', category: 'animate', params: ['ySquares', 'maxSquareWidth'] },
  { name: 'stack', label: 'Stack', category: 'animate', params: ['ySquares'] },
];

export const DEFAULT_EFFECT_PARAMS: EffectParams = {
  threshold: 128,
  gridAngle: 0,
  ySquares: 20,
  xSquares: 20,
  maxSquareWidth: 20,
  blur: 0,
  grain: 0,
  gamma: 1,
  blackPoint: 0,
  whitePoint: 255,
  showEffect: true,
};