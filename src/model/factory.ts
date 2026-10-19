import type {
  El,
  GradientEl,
  GradientSpec,
  GroupEl,
  ImageEl,
  ImageSrc,
  RectEl,
  TextEl,
  TextStyle,
  TextureEl,
} from './types';

let counter = 0;
export const uid = (p = 'el') =>
  `${p}_${Date.now().toString(36)}${(counter++).toString(36)}${Math.random().toString(36).slice(2, 6)}`;

const base = (name: string, x = 0, y = 0) => ({
  id: uid(),
  name,
  x,
  y,
  rotation: 0,
  scaleX: 1,
  scaleY: 1,
  opacity: 1,
  visible: true,
  locked: false,
  blend: 'source-over' as const,
});

export const DEFAULT_TEXT_STYLE: TextStyle = {
  fontFamily: 'Anton',
  fontSize: 96,
  fontStyle: 'normal',
  fill: '#F2DFB6',
  letterSpacing: 0,
  lineHeight: 1,
  align: 'center',
  mode: 'plain',
  arc: 0,
  warp: 0,
  seed: 7,
  stroke: '#10090F',
  strokeWidth: 0,
  outline2: '#F02D35',
  outline2Width: 0,
  shadowColor: '#10090F',
  shadowX: 0,
  shadowY: 0,
  extrudeColor: '#390713',
  extrudeDepth: 0,
  extrudeAngle: 45,
  misregColor: '#17166F',
  misregOffset: 0,
  inkWear: 0,
  label: 'none',
  labelFill: '#F2DFB6',
  labelStroke: '#10090F',
  labelPadding: 0.35,
};

type Partial2<T> = { [K in keyof T]?: T[K] };
type Common = Partial2<Omit<El, 'type' | 'children'>> & Record<string, unknown>;

export function makeImage(
  src: ImageSrc,
  width: number,
  height: number,
  opts: Partial2<ImageEl> = {},
): ImageEl {
  return { ...base('Image'), type: 'image', src, width, height, ...opts };
}

export function makeText(text: string, style: Partial2<TextStyle> = {}, opts: Common = {}): TextEl {
  return {
    ...base(text.split('\n')[0].slice(0, 24) || 'Text'),
    type: 'text',
    text,
    style: { ...DEFAULT_TEXT_STYLE, ...style },
    ...(opts as Partial2<TextEl>),
  };
}

export function makeRect(width: number, height: number, fill: string, opts: Partial2<RectEl> = {}): RectEl {
  return {
    ...base('Color block'),
    type: 'rect',
    width,
    height,
    fill,
    stroke: '#10090F',
    strokeWidth: 0,
    cornerRadius: 0,
    ...opts,
  };
}

export function makeGradient(
  gradient: GradientSpec,
  width: number,
  height: number,
  opts: Partial2<GradientEl> = {},
): GradientEl {
  return {
    ...base('Gradient'),
    type: 'gradient',
    width,
    height,
    fit: true,
    gradient: structuredClone(gradient),
    ...opts,
  };
}

export function makeTexture(
  textureId: string,
  width: number,
  height: number,
  opts: Partial2<TextureEl> = {},
): TextureEl {
  return {
    ...base('Texture'),
    type: 'texture',
    textureId,
    width,
    height,
    fit: true,
    tileScale: 1,
    locked: true,
    ...opts,
  };
}

export function makeGroup(children: El[], opts: Partial2<GroupEl> = {}): GroupEl {
  return { ...base('Group'), type: 'group', children, ...opts };
}

/** Deep-clone an element tree giving every node a fresh id. */
export function cloneFresh<T extends El>(el: T): T {
  const c = structuredClone(el);
  const walk = (e: El) => {
    e.id = uid();
    if (e.type === 'group') e.children.forEach(walk);
  };
  walk(c);
  return c;
}
