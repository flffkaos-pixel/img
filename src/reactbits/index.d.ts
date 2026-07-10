import { FC, ReactNode } from 'react';

export interface AuroraProps {
  colorStops?: string[];
  amplitude?: number;
  blend?: number;
  time?: number;
  speed?: number;
}
export const Aurora: FC<AuroraProps>;

export interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
  color?: string;
  shineColor?: string;
  spread?: number;
  yoyo?: boolean;
  pauseOnHover?: boolean;
  direction?: 'left' | 'right';
  delay?: number;
}
export const ShinyText: FC<ShinyTextProps>;

export interface DockItem {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
}
export interface DockProps {
  items: DockItem[];
  className?: string;
  spring?: { mass: number; stiffness: number; damping: number };
  magnification?: number;
  distance?: number;
  panelHeight?: number;
  dockHeight?: number;
  baseItemSize?: number;
}
export const Dock: FC<DockProps>;
