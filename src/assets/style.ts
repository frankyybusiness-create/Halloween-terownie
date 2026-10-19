/**
 * Shared drawing language for every generated asset: thick imperfect ink
 * outlines, misregistered screen-print fills, halftone shading and three
 * levels of print distress (clean / distressed / heavy).
 */
import type { Variant } from '../model/types';

export const C = {
  blood: '#8F1018',
  scarlet: '#F02D35',
  burgundy: '#390713',
  ink: '#10090F',
  orange: '#F47B20',
  cream: '#F2DFB6',
  navy: '#17166F',
  violet: '#6729A6',
  paper: '#FFF4DA',
  bone: '#E9D3A4',
  coffee: '#6B3A1E',
  latte: '#C98B55',
  caramel: '#D98A2B',
  glass: '#CFE3F0',
} as const;

export type Pt = [number, number];

export function rng(seed: number) {
  let a = seed >>> 0 || 1;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const f = (n: number) => Math.round(n * 10) / 10;

/** Jitter points then draw a smooth Catmull-Rom curve through them. */
export function wob(pts: Pt[], amp = 3, seed = 1, closed = true): string {
  const r = rng(seed);
  const p = pts.map(([x, y]) => [x + (r() - 0.5) * 2 * amp, y + (r() - 0.5) * 2 * amp] as Pt);
  return smooth(p, closed);
}

export function smooth(p: Pt[], closed = true, tension = 1): string {
  const n = p.length;
  if (n < 2) return '';
  const get = (i: number) => (closed ? p[(i + n) % n] : p[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${f(p[0][0])} ${f(p[0][1])}`;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = get(i - 1), p1 = get(i), p2 = get(i + 1), p3 = get(i + 2);
    const c1x = p1[0] + ((p2[0] - p0[0]) / 6) * tension;
    const c1y = p1[1] + ((p2[1] - p0[1]) / 6) * tension;
    const c2x = p2[0] - ((p3[0] - p1[0]) / 6) * tension;
    const c2y = p2[1] - ((p3[1] - p1[1]) / 6) * tension;
    d += `C${f(c1x)} ${f(c1y)} ${f(c2x)} ${f(c2y)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return closed ? d + 'Z' : d;
}

/** Straight-edged polygon with slight jitter (for cut paper / jagged shapes). */
export function poly(pts: Pt[], amp = 0, seed = 1, closed = true): string {
  const r = rng(seed);
  return (
    pts
      .map(([x, y], i) => `${i ? 'L' : 'M'}${f(x + (r() - 0.5) * 2 * amp)} ${f(y + (r() - 0.5) * 2 * amp)}`)
      .join('') + (closed ? 'Z' : '')
  );
}

export function ell(cx: number, cy: number, rx: number, ry: number, n = 18, a0 = 0, a1 = Math.PI * 2): Pt[] {
  const out: Pt[] = [];
  const full = Math.abs(a1 - a0 - Math.PI * 2) < 1e-6;
  const steps = full ? n : n + 1;
  for (let i = 0; i < steps; i++) {
    const a = a0 + ((a1 - a0) * i) / n;
    out.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]);
  }
  return out;
}

export function starPts(cx: number, cy: number, ro: number, ri: number, n: number, rot = -Math.PI / 2, jitter = 0, seed = 1): Pt[] {
  const r = rng(seed);
  const out: Pt[] = [];
  for (let i = 0; i < n * 2; i++) {
    const rad = (i % 2 ? ri : ro) * (1 + (r() - 0.5) * jitter);
    const a = rot + (i * Math.PI) / n;
    out.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad]);
  }
  return out;
}

export const circ = (cx: number, cy: number, r: number, amp = 2, seed = 1, n = 14) =>
  wob(ell(cx, cy, r, r, n), amp, seed);

/** Hand-drawn open stroke path. */
export const line = (pts: Pt[], amp = 1.5, seed = 1) => wob(pts, amp, seed, false);

let shapeId = 0;

interface ShapeOpts {
  sw?: number;
  ink?: string | false;
  /** Halftone shading on the bottom-right of the shape. */
  shade?: number | false;
  shadeColor?: string;
  shadeDx?: number;
  shadeDy?: number;
  opacity?: number;
  /** Fill stays registered (not offset) — for tiny details. */
  registered?: boolean;
}

/**
 * Collects fill / shade / ink layers separately so the variant can
 * misregister the colour plate against the key (ink) plate.
 */
interface Level { fills: string[]; fixed: string[]; shades: string[]; inks: string[] }
const lvl = (): Level => ({ fills: [], fixed: [], shades: [], inks: [] });

/**
 * Collects fill / shade / ink layers separately so the variant can
 * misregister the colour plate against the key (ink) plate. Call next()
 * to stack following shapes fully above earlier ones.
 */
export class Art {
  levels: Level[] = [lvl()];
  defs: string[] = [];
  top: string[] = [];

  private get L() {
    return this.levels[this.levels.length - 1];
  }

  next() {
    this.levels.push(lvl());
    return this;
  }

  shape(d: string, fill: string, o: ShapeOpts = {}) {
    const L = this.L;
    const op = o.opacity != null ? ` opacity="${o.opacity}"` : '';
    if (fill !== 'none') (o.registered ? L.fixed : L.fills).push(`<path d="${d}" fill="${fill}"${op}/>`);
    if (o.shade) {
      const id = `m${shapeId++}`;
      const dx = o.shadeDx ?? -18, dy = o.shadeDy ?? -14;
      this.defs.push(
        `<mask id="${id}" maskUnits="userSpaceOnUse" x="-2000" y="-2000" width="5000" height="5000"><path d="${d}" fill="#fff"/><path d="${d}" fill="#000" transform="translate(${dx} ${dy})"/></mask>`,
      );
      L.shades.push(
        `<g mask="url(#${id})"><rect x="-2000" y="-2000" width="5000" height="5000" fill="url(#${o.shadeColor === 'cream' ? 'htc' : 'ht'})" opacity="${o.shade}"/></g>`,
      );
    }
    if (o.ink !== false) {
      L.inks.push(
        `<path d="${d}" fill="none" stroke="${o.ink ?? C.ink}" stroke-width="${o.sw ?? 8}" stroke-linejoin="round" stroke-linecap="round"/>`,
      );
    }
    return this;
  }

  /** Solid ink shape (no outline needed). */
  solid(d: string, color: string = C.ink, opacity = 1) {
    this.L.inks.push(`<path d="${d}" fill="${color}"${opacity < 1 ? ` opacity="${opacity}"` : ''}/>`);
    return this;
  }

  stroke(d: string, sw = 7, color: string = C.ink, opacity = 1) {
    this.L.inks.push(
      `<path d="${d}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"${opacity < 1 ? ` opacity="${opacity}"` : ''}/>`,
    );
    return this;
  }

  /** Cream / white highlight flicks drawn on top of everything. */
  hi(d: string, sw = 5, color: string = C.paper) {
    this.top.push(`<path d="${d}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round"/>`);
    return this;
  }

  hiFill(d: string, color: string = C.paper) {
    this.top.push(`<path d="${d}" fill="${color}"/>`);
    return this;
  }

  raw(svg: string, layer: 'fills' | 'inks' | 'top' | 'fixed' = 'inks') {
    if (layer === 'top') this.top.push(svg);
    else this.L[layer].push(svg);
    return this;
  }

  render(v: Variant, w: number, h: number): string {
    const off = v === 'clean' ? 0 : v === 'distressed' ? 4 : 7;
    const t = `translate(${off} ${off * 0.7})`;
    const body =
      this.levels
        .map((L) => `<g transform="${t}">${L.fills.join('')}</g>${L.fixed.join('')}<g transform="${t}">${L.shades.join('')}</g>${L.inks.join('')}`)
        .join('') + this.top.join('');
    return svgDoc(w, h, body, v, this.defs.join(''));
  }
}

const FILTERS: Record<Variant, string> = {
  clean: '',
  distressed: `<filter id="vf" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="4" result="w"/>
    <feDisplacementMap in="SourceGraphic" in2="w" scale="5" xChannelSelector="R" yChannelSelector="G" result="d"/>
    <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="11" result="s"/>
    <feColorMatrix in="s" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -40 28.4" result="m"/>
    <feComposite in="d" in2="m" operator="in"/>
  </filter>`,
  heavy: `<filter id="vf" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves="3" seed="9" result="w"/>
    <feDisplacementMap in="SourceGraphic" in2="w" scale="10" xChannelSelector="R" yChannelSelector="G" result="d"/>
    <feTurbulence type="fractalNoise" baseFrequency="0.12" numOctaves="2" seed="21" result="s"/>
    <feColorMatrix in="s" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -34 23" result="m1"/>
    <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed="5" result="b"/>
    <feColorMatrix in="b" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -24 16.4" result="m2"/>
    <feComposite in="m1" in2="m2" operator="in" result="m"/>
    <feComposite in="d" in2="m" operator="in"/>
  </filter>`,
};

export const PATTERN_DEFS = `
<pattern id="ht" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><circle cx="4.5" cy="4.5" r="2.4" fill="${C.ink}"/></pattern>
<pattern id="htc" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><circle cx="4.5" cy="4.5" r="2.2" fill="${C.paper}"/></pattern>
<pattern id="htr" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><circle cx="5" cy="5" r="2.8" fill="${C.scarlet}"/></pattern>
<pattern id="htl" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><circle cx="8" cy="8" r="4.6" fill="${C.ink}"/></pattern>
<pattern id="hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)"><rect width="10" height="3.2" fill="${C.ink}"/></pattern>`;

export function svgDoc(w: number, h: number, body: string, v: Variant, extraDefs = ''): string {
  const filt = FILTERS[v];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs>${PATTERN_DEFS}${filt}${extraDefs}</defs><g${filt ? ' filter="url(#vf)"' : ''}>${body}</g></svg>`;
}

/** Helper for assets that don't need fill/ink separation. */
export const plain = (w: number, h: number, body: string, v: Variant, defs = '') => svgDoc(w, h, body, v, defs);

export const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
