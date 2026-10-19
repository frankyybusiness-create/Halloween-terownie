export type Variant = 'clean' | 'distressed' | 'heavy';

export type BlendMode =
  | 'source-over'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'soft-light'
  | 'hard-light'
  | 'color-burn'
  | 'color-dodge'
  | 'darken'
  | 'lighten'
  | 'difference'
  | 'luminosity';

export type SlotId = 'ghostface' | 'mascot' | 'logo';

export type ImageSrc =
  | { kind: 'asset'; assetId: string; variant: Variant }
  | { kind: 'upload'; uploadId: string }
  | { kind: 'slot'; slotId: SlotId };

interface Base {
  id: string;
  name: string;
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  opacity: number;
  visible: boolean;
  locked: boolean;
  blend: BlendMode;
}

export interface ImageEl extends Base {
  type: 'image';
  src: ImageSrc;
  width: number;
  height: number;
  flipX?: boolean;
  flipY?: boolean;
}

export type TextMode = 'plain' | 'arc' | 'warp' | 'ransom';
export type LabelShape = 'none' | 'pill' | 'rect' | 'tag' | 'burst' | 'torn';

export interface TextStyle {
  fontFamily: string;
  fontSize: number;
  fontStyle: 'normal' | 'bold' | 'italic';
  fill: string;
  letterSpacing: number;
  lineHeight: number;
  align: 'left' | 'center' | 'right';
  mode: TextMode;
  /** Arc span in degrees (arc mode). Positive arches up, negative curves down. */
  arc: number;
  /** 0..1 strength of per-letter irregularity (warp & ransom modes). */
  warp: number;
  seed: number;
  /** Inner outline. */
  stroke: string;
  strokeWidth: number;
  /** Outer (second) outline. */
  outline2: string;
  outline2Width: number;
  shadowColor: string;
  shadowX: number;
  shadowY: number;
  extrudeColor: string;
  extrudeDepth: number;
  extrudeAngle: number;
  misregColor: string;
  misregOffset: number;
  /** 0..1 speckled ink wear. */
  inkWear: number;
  label: LabelShape;
  labelFill: string;
  labelStroke: string;
  labelPadding: number;
}

export interface TextEl extends Base {
  type: 'text';
  text: string;
  style: TextStyle;
  /** Insert-time only: centre the text box on this point, then removed. */
  anchor?: { cx: number; cy: number };
}

export interface RectEl extends Base {
  type: 'rect';
  width: number;
  height: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  cornerRadius: number;
}

export interface GradientStop {
  offset: number;
  color: string;
  alpha: number;
}

export interface GradientSpec {
  kind: 'linear' | 'radial';
  angle: number;
  /** Radial centre and radius as fractions of the element box. */
  cx: number;
  cy: number;
  r: number;
  stops: GradientStop[];
}

export interface GradientEl extends Base {
  type: 'gradient';
  width: number;
  height: number;
  /** When true the element always covers the whole canvas. */
  fit: boolean;
  gradient: GradientSpec;
}

export interface TextureEl extends Base {
  type: 'texture';
  textureId: string;
  width: number;
  height: number;
  fit: boolean;
  /** Pattern tile scale for tiling textures. */
  tileScale: number;
}

export interface GroupEl extends Base {
  type: 'group';
  children: El[];
}

export type El = ImageEl | TextEl | RectEl | GradientEl | TextureEl | GroupEl;

export interface Upload {
  id: string;
  name: string;
  dataUrl: string;
  width: number;
  height: number;
}

export interface Doc {
  version: 1;
  name: string;
  width: number;
  height: number;
  elements: El[];
  uploads: Record<string, Upload>;
  slots: Record<SlotId, string | null>;
}

export const FORMATS = [
  { id: 'portrait', label: 'IG Portrait', width: 1080, height: 1350 },
  { id: 'square', label: 'IG Square', width: 1080, height: 1080 },
  { id: 'story', label: 'IG Story', width: 1080, height: 1920 },
] as const;

export type FormatId = (typeof FORMATS)[number]['id'];
