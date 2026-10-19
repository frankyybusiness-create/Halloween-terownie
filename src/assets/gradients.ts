import type { GradientSpec } from '../model/types';
import { C } from './style';

export interface BackgroundPreset {
  id: string;
  name: string;
  /** 'background' replaces the canvas background; 'overlay' is added above it. */
  role: 'background' | 'overlay';
  gradient: GradientSpec;
  /** Textures added together with this preset (id, opacity). */
  textures?: [string, number][];
  overlayBlend?: 'source-over' | 'screen' | 'multiply' | 'soft-light';
}

const lin = (angle: number, ...stops: [number, string, number?][]): GradientSpec => ({
  kind: 'linear', angle, cx: 0.5, cy: 0.5, r: 0.7,
  stops: stops.map(([offset, color, alpha]) => ({ offset, color, alpha: alpha ?? 1 })),
});
const rad = (cx: number, cy: number, r: number, ...stops: [number, string, number?][]): GradientSpec => ({
  kind: 'radial', angle: 0, cx, cy, r,
  stops: stops.map(([offset, color, alpha]) => ({ offset, color, alpha: alpha ?? 1 })),
});

export const BACKGROUNDS: BackgroundPreset[] = [
  { id: 'scarlet-burgundy', name: 'Scarlet → Burgundy', role: 'background', gradient: lin(90, [0, C.scarlet], [0.55, C.blood], [1, C.burgundy]) },
  { id: 'blood-black', name: 'Blood Red → Black', role: 'background', gradient: lin(90, [0, C.blood], [0.6, C.burgundy], [1, C.ink]) },
  { id: 'orange-crimson', name: 'Burnt Orange → Crimson', role: 'background', gradient: lin(110, [0, C.orange], [0.5, C.scarlet], [1, C.blood]) },
  { id: 'red-radial', name: 'Red Radial Glow', role: 'background', gradient: rad(0.5, 0.42, 0.75, [0, C.scarlet], [0.45, C.blood], [1, C.burgundy]) },
  { id: 'cream-paper-bg', name: 'Vintage Faded Cream', role: 'background', gradient: lin(90, [0, '#F7E9C8'], [1, C.cream]), textures: [['cream-paper', 1], ['paper-grain', 0.6]] },
  { id: 'dark-comic', name: 'Dark Distressed Comic', role: 'background', gradient: rad(0.5, 0.35, 0.9, [0, C.burgundy], [0.6, '#22070E'], [1, C.ink]), textures: [['halftone-coarse', 0.35], ['grunge', 0.5]] },
  { id: 'red-haze-bg', name: 'Red Atmospheric Haze', role: 'background', gradient: lin(90, [0, C.ink], [0.5, C.burgundy], [1, C.blood]), textures: [['red-haze', 0.85]] },
  { id: 'navy-night', name: 'Terownie Navy Night', role: 'background', gradient: lin(90, [0, C.navy], [0.65, '#0E0D3E'], [1, C.ink]) },
  { id: 'dark-vignette', name: 'Dark Vignette', role: 'overlay', gradient: rad(0.5, 0.5, 0.75, [0, C.ink, 0], [0.55, C.ink, 0.15], [1, C.ink, 0.92]) },
  { id: 'red-glow', name: 'Red Glow Spot', role: 'overlay', gradient: rad(0.5, 0.4, 0.55, [0, C.scarlet, 0.85], [0.5, C.scarlet, 0.3], [1, C.scarlet, 0]), overlayBlend: 'screen' },
  { id: 'violet-navy-glow', name: 'Purple & Navy Glow', role: 'overlay', gradient: rad(0.15, 0.1, 0.8, [0, C.violet, 0.85], [0.45, C.navy, 0.45], [1, C.navy, 0]), overlayBlend: 'screen' },
  { id: 'bottom-burn', name: 'Burgundy Bottom Burn', role: 'overlay', gradient: lin(90, [0, C.burgundy, 0], [0.6, C.burgundy, 0], [1, C.ink, 0.95]) },
  { id: 'orange-fire-glow', name: 'Orange Fire Glow', role: 'overlay', gradient: rad(0.5, 1, 0.7, [0, C.orange, 0.8], [0.5, C.scarlet, 0.35], [1, C.scarlet, 0]), overlayBlend: 'screen' },
];

export const PALETTE = [
  { name: 'Blood red', hex: C.blood },
  { name: 'Scarlet', hex: C.scarlet },
  { name: 'Deep burgundy', hex: C.burgundy },
  { name: 'Near-black', hex: C.ink },
  { name: 'Burnt orange', hex: C.orange },
  { name: 'Aged cream', hex: C.cream },
  { name: 'Terownie navy', hex: C.navy },
  { name: 'Electric violet', hex: C.violet },
  { name: 'Paper', hex: C.paper },
  { name: 'Candle yellow', hex: '#FFD86A' },
];

export function rgba(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}
