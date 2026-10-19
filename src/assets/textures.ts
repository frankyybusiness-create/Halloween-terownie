/**
 * Procedurally generated print / analog textures. Rendered to canvas at the
 * element's own size so grain never stretches, and cached per size.
 */
import type { BlendMode } from '../model/types';
import { rng } from './style';

export interface TextureDef {
  id: string;
  name: string;
  group: 'Paper & Print' | 'Halftone' | 'Analog' | 'Grunge & Atmosphere';
  tags: string[];
  blend: BlendMode;
  opacity: number;
  gen: (w: number, h: number) => HTMLCanvasElement;
}

const mk = (w: number, h: number) => {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
};

/** Smooth value-noise field (0..1) made by upscaling random grids. */
function field(w: number, h: number, cell: number, seed: number, octaves = 3): Float32Array {
  const out = new Float32Array(w * h);
  const c = mk(w, h);
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  let amp = 1, total = 0;
  const r = rng(seed);
  for (let o = 0; o < octaves; o++) {
    const gw = Math.max(2, Math.ceil(w / cell) + 2), gh = Math.max(2, Math.ceil(h / cell) + 2);
    const g = mk(gw, gh);
    const gctx = g.getContext('2d')!;
    const id = gctx.createImageData(gw, gh);
    for (let i = 0; i < gw * gh; i++) {
      const v = r() * 255;
      id.data[i * 4] = id.data[i * 4 + 1] = id.data[i * 4 + 2] = v;
      id.data[i * 4 + 3] = 255;
    }
    gctx.putImageData(id, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(g, 1, 1, gw - 2, gh - 2, 0, 0, w, h);
    const px = ctx.getImageData(0, 0, w, h).data;
    for (let i = 0; i < w * h; i++) out[i] += (px[i * 4] / 255) * amp;
    total += amp;
    amp *= 0.5;
    cell = Math.max(2, cell / 2);
  }
  for (let i = 0; i < out.length; i++) out[i] /= total;
  return out;
}

function pixels(w: number, h: number, fn: (i: number, x: number, y: number, d: Uint8ClampedArray) => void) {
  const c = mk(w, h);
  const ctx = c.getContext('2d')!;
  const id = ctx.createImageData(w, h);
  const d = id.data;
  for (let y = 0, i = 0; y < h; y++) for (let x = 0; x < w; x++, i++) fn(i, x, y, d);
  ctx.putImageData(id, 0, 0);
  return c;
}

const set = (d: Uint8ClampedArray, i: number, r: number, g: number, b: number, a: number) => {
  const k = i * 4;
  d[k] = r; d[k + 1] = g; d[k + 2] = b; d[k + 3] = a;
};

const sstep = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

function halftone(w: number, h: number, spacing: number, maxR: number, color: string, mod: (x: number, y: number) => number, angle = 45, offset = [0, 0]) {
  const c = mk(w, h);
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = color;
  const t = (angle * Math.PI) / 180;
  const diag = Math.hypot(w, h);
  ctx.beginPath();
  for (let gy = -diag; gy < diag; gy += spacing) {
    for (let gx = -diag; gx < diag; gx += spacing) {
      const x = w / 2 + gx * Math.cos(t) - gy * Math.sin(t) + offset[0];
      const y = h / 2 + gx * Math.sin(t) + gy * Math.cos(t) + offset[1];
      if (x < -spacing || y < -spacing || x > w + spacing || y > h + spacing) continue;
      const r = maxR * mod(Math.max(0, Math.min(w - 1, x)), Math.max(0, Math.min(h - 1, y)));
      if (r < 0.35) continue;
      ctx.moveTo(x + r, y);
      ctx.arc(x, y, r, 0, Math.PI * 2);
    }
  }
  ctx.fill();
  return c;
}

const fieldAt = (f: Float32Array, w: number) => (x: number, y: number) => f[(y | 0) * w + (x | 0)];

export const TEXTURES: TextureDef[] = [
  {
    id: 'paper-grain', name: 'Vintage Paper Grain', group: 'Paper & Print', tags: ['paper', 'grain', 'vintage', 'fiber'],
    blend: 'multiply', opacity: 0.7,
    gen: (w, h) => {
      const r = rng(1);
      const f = field(w, h, 160, 2);
      const c = pixels(w, h, (i, _x, _y, d) => {
        const v = 255 - r() * 26 - f[i] * 40;
        set(d, i, v, v * 0.96, v * 0.88, 255);
      });
      const ctx = c.getContext('2d')!;
      ctx.strokeStyle = 'rgba(90,60,30,.12)';
      for (let k = 0; k < (w * h) / 900; k++) {
        const x = r() * w, y = r() * h, a = r() * Math.PI, l = 4 + r() * 18;
        ctx.lineWidth = 0.6 + r();
        ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + Math.cos(a) * l * 0.5 + r() * 4, y + Math.sin(a) * l * 0.5, x + Math.cos(a) * l, y + Math.sin(a) * l); ctx.stroke();
      }
      return c;
    },
  },
  {
    id: 'cream-paper', name: 'Distressed Cream Paper', group: 'Paper & Print', tags: ['paper', 'cream', 'background', 'aged', 'stain'],
    blend: 'source-over', opacity: 1,
    gen: (w, h) => {
      const r = rng(3);
      const f = field(w, h, 300, 4), g = field(w, h, 60, 5, 2);
      return pixels(w, h, (i, x, y, d) => {
        const edge = Math.min(x, y, w - x, h - y) / Math.min(w, h);
        const burn = 1 - sstep(0, 0.12, edge);
        const stain = sstep(0.55, 0.75, f[i]) * 0.5;
        const n = r() * 14 + g[i] * 18;
        const k = 1 - burn * 0.35 - stain * 0.18;
        set(d, i, (242 - n) * k, (223 - n) * k * 0.98, (182 - n * 1.1) * k * 0.92, 255);
      });
    },
  },
  {
    id: 'photocopy', name: 'Photocopy Noise', group: 'Paper & Print', tags: ['photocopy', 'xerox', 'toner', 'noise', 'zine'],
    blend: 'multiply', opacity: 0.85,
    gen: (w, h) => {
      const r = rng(7);
      const f = field(w, h, 24, 8, 3);
      const band = field(w, 1, 90, 9, 2);
      return pixels(w, h, (i, x, y, d) => {
        const edge = Math.min(x, w - x) / w;
        let a = sstep(0.66, 0.74, f[i]) * 0.9;
        if (r() < 0.004) a = 1;
        a = Math.max(a, (1 - sstep(0, 0.04, edge)) * (0.5 + band[x] * 0.5) * (r() < 0.6 ? 1 : 0));
        if ((y + (x >> 6)) % 97 === 0 && r() < 0.5) a = Math.max(a, 0.35);
        set(d, i, 16, 9, 15, a * 255);
      });
    },
  },
  {
    id: 'screenprint', name: 'Screen-Print Grain', group: 'Paper & Print', tags: ['screen', 'print', 'grain', 'knockout', 'speckle'],
    blend: 'source-over', opacity: 0.75,
    gen: (w, h) => {
      const f = field(w, h, 10, 12, 2), g = field(w, h, 200, 13, 2);
      return pixels(w, h, (i, _x, _y, d) => {
        const a = sstep(0.62 - g[i] * 0.08, 0.66 - g[i] * 0.08, f[i]);
        set(d, i, 242, 223, 182, a * 255);
      });
    },
  },
  {
    id: 'faded-print', name: 'Faded Print', group: 'Paper & Print', tags: ['faded', 'print', 'worn', 'wash'],
    blend: 'screen', opacity: 0.6,
    gen: (w, h) => {
      const f = field(w, h, 220, 21, 4);
      return pixels(w, h, (i, _x, _y, d) => set(d, i, 242, 223, 182, sstep(0.45, 0.8, f[i]) * 170));
    },
  },
  {
    id: 'torn-edges', name: 'Torn Paper Edges', group: 'Paper & Print', tags: ['torn', 'paper', 'edge', 'rip', 'border'],
    blend: 'source-over', opacity: 1,
    gen: (w, h) => {
      const c = mk(w, h);
      const ctx = c.getContext('2d')!;
      const r = rng(31);
      const edge = (y0: number, dir: number) => {
        const depth = h * 0.05;
        ctx.beginPath();
        ctx.moveTo(0, dir > 0 ? 0 : h);
        for (let x = 0; x <= w + 12; x += 12) ctx.lineTo(x, y0 + dir * (depth * 0.5 + r() * depth * 0.6));
        ctx.lineTo(w, dir > 0 ? 0 : h);
        ctx.closePath();
        ctx.save();
        ctx.shadowColor = 'rgba(16,9,15,.55)'; ctx.shadowBlur = 8; ctx.shadowOffsetY = dir * 5;
        ctx.fillStyle = '#F2DFB6'; ctx.fill();
        ctx.restore();
        ctx.strokeStyle = 'rgba(255,248,231,.9)'; ctx.lineWidth = 3; ctx.stroke();
      };
      edge(0, 1);
      edge(h, -1);
      return c;
    },
  },
  {
    id: 'halftone-fine', name: 'Fine Halftone', group: 'Halftone', tags: ['halftone', 'dots', 'fine', 'comic', 'benday'],
    blend: 'multiply', opacity: 0.45,
    gen: (w, h) => {
      const f = field(w, h, 260, 41, 2);
      const at = fieldAt(f, w);
      return halftone(w, h, 9, 3.4, '#10090F', (x, y) => sstep(0.25, 0.75, at(x, y)));
    },
  },
  {
    id: 'halftone-coarse', name: 'Coarse Halftone', group: 'Halftone', tags: ['halftone', 'dots', 'coarse', 'comic', 'pop'],
    blend: 'multiply', opacity: 0.4,
    gen: (w, h) => halftone(w, h, 24, 11, '#10090F', (_x, y) => sstep(0.15, 1, y / h)),
  },
  {
    id: 'halftone-red', name: 'Red Halftone Wash', group: 'Halftone', tags: ['halftone', 'red', 'dots', 'pop'],
    blend: 'source-over', opacity: 0.5,
    gen: (w, h) => halftone(w, h, 16, 7, '#F02D35', (x, y) => 1 - sstep(0, 0.7, Math.hypot(x / w - 0.5, y / h - 0.5)), 30),
  },
  {
    id: 'misregistration', name: 'Misregistration', group: 'Halftone', tags: ['misregistration', 'misprint', 'offset', 'cmyk', 'print'],
    blend: 'multiply', opacity: 0.6,
    gen: (w, h) => {
      const c = mk(w, h);
      const ctx = c.getContext('2d')!;
      const f = field(w, h, 240, 51, 2);
      const at = fieldAt(f, w);
      const m = (x: number, y: number) => sstep(0.55, 0.8, at(x, y));
      ctx.drawImage(halftone(w, h, 14, 5.6, '#F02D35', m, 15, [5, -3]), 0, 0);
      ctx.globalCompositeOperation = 'multiply';
      ctx.drawImage(halftone(w, h, 14, 5.6, '#17166F', m, 75, [-5, 4]), 0, 0);
      return c;
    },
  },
  {
    id: 'tv-static', name: 'Analog TV Static', group: 'Analog', tags: ['tv', 'static', 'noise', 'analog', 'snow'],
    blend: 'screen', opacity: 0.35,
    gen: (w, h) => {
      const r = rng(61);
      return pixels(w, h, (i, _x, y, d) => {
        const v = r() * 255 * (y % 3 === 0 ? 0.6 : 1);
        set(d, i, v, v, v, 255);
      });
    },
  },
  {
    id: 'vhs', name: 'VHS Noise', group: 'Analog', tags: ['vhs', 'tape', 'scanlines', 'glitch', 'tracking'],
    blend: 'screen', opacity: 0.55,
    gen: (w, h) => {
      const r = rng(71);
      const bands = [r() * h, r() * h, r() * h];
      const c = pixels(w, h, (i, x, y, d) => {
        let a = y % 4 < 1 ? 40 : 0;
        let v = 0;
        for (const b of bands) {
          const dist = Math.abs(y - b);
          if (dist < 14) { a = Math.max(a, (1 - dist / 14) * 140 * (r() * 0.7 + 0.3)); v = 255; }
        }
        if (r() < 0.0015) { a = 255; v = 255; }
        set(d, i, v || 120, v ? 230 : 40, v ? 255 : 60, a);
        void x;
      });
      return c;
    },
  },
  {
    id: 'film-grain', name: 'Film Grain', group: 'Analog', tags: ['film', 'grain', 'noise', 'analog', 'cinema'],
    blend: 'overlay', opacity: 0.5,
    gen: (w, h) => {
      const r = rng(81);
      return pixels(w, h, (i, _x, _y, d) => {
        const v = 128 + (r() + r() + r() - 1.5) * 120;
        set(d, i, v, v, v, 255);
      });
    },
  },
  {
    id: 'grunge', name: 'Grunge Overlay', group: 'Grunge & Atmosphere', tags: ['grunge', 'dirt', 'stain', 'distressed'],
    blend: 'multiply', opacity: 0.6,
    gen: (w, h) => {
      const f = field(w, h, 140, 91, 4), g = field(w, h, 12, 92, 2);
      const r = rng(93);
      const c = pixels(w, h, (i, _x, _y, d) => {
        const a = sstep(0.58, 0.85, f[i]) * 0.7 + sstep(0.7, 0.75, g[i]) * 0.5;
        set(d, i, 30, 14, 18, Math.min(1, a) * 255);
      });
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = 'rgba(16,9,15,.8)';
      for (let k = 0; k < 6; k++) {
        const cx = r() * w, cy = r() * h;
        for (let j = 0; j < 40; j++) {
          const a = r() * Math.PI * 2, dist = r() ** 2 * 120, rad = 1 + r() * 6;
          ctx.beginPath(); ctx.arc(cx + Math.cos(a) * dist, cy + Math.sin(a) * dist, rad, 0, Math.PI * 2); ctx.fill();
        }
      }
      return c;
    },
  },
  {
    id: 'scratched-ink', name: 'Scratched Ink', group: 'Grunge & Atmosphere', tags: ['scratch', 'ink', 'scratched', 'dust', 'worn'],
    blend: 'screen', opacity: 0.7,
    gen: (w, h) => {
      const c = mk(w, h);
      const ctx = c.getContext('2d')!;
      const r = rng(101);
      ctx.strokeStyle = '#F2DFB6';
      ctx.lineCap = 'round';
      for (let k = 0; k < (w * h) / 9000; k++) {
        const x = r() * w, y = r() * h, l = 20 + r() * 200, a = Math.PI / 2 + (r() - 0.5) * 0.5;
        ctx.globalAlpha = 0.25 + r() * 0.6;
        ctx.lineWidth = 0.5 + r() * 1.6;
        ctx.beginPath(); ctx.moveTo(x, y);
        ctx.quadraticCurveTo(x + (r() - 0.5) * 20, y + l / 2, x + Math.cos(a) * l, y + Math.sin(a) * l);
        ctx.stroke();
      }
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = '#F2DFB6';
      for (let k = 0; k < (w * h) / 2500; k++) ctx.fillRect(r() * w, r() * h, 1 + r() * 2, 1 + r() * 2);
      return c;
    },
  },
  {
    id: 'rough-edges', name: 'Rough Ink Edges', group: 'Grunge & Atmosphere', tags: ['ink', 'edge', 'frame', 'rough', 'border'],
    blend: 'source-over', opacity: 1,
    gen: (w, h) => {
      const f = field(w, h, 50, 111, 3);
      const r = rng(112);
      const m = Math.min(w, h);
      return pixels(w, h, (i, x, y, d) => {
        const edge = Math.min(x, y, w - x, h - y) / m;
        const t = 0.035 + (f[i] - 0.5) * 0.05;
        let a = edge < t ? 1 : 0;
        if (!a && edge < t + 0.03 && r() < 0.02) a = 1;
        set(d, i, 16, 9, 15, a * 255);
      });
    },
  },
  {
    id: 'vignette', name: 'Dark Vignette', group: 'Grunge & Atmosphere', tags: ['vignette', 'dark', 'edges', 'shadow'],
    blend: 'multiply', opacity: 0.9,
    gen: (w, h) => {
      const c = mk(w, h);
      const ctx = c.getContext('2d')!;
      const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.25, w / 2, h / 2, Math.hypot(w, h) * 0.55);
      g.addColorStop(0, 'rgba(16,9,15,0)');
      g.addColorStop(0.6, 'rgba(16,9,15,.45)');
      g.addColorStop(1, 'rgba(16,9,15,.95)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      return c;
    },
  },
  {
    id: 'red-haze', name: 'Red Atmospheric Haze', group: 'Grunge & Atmosphere', tags: ['haze', 'red', 'fog', 'atmosphere', 'smoke'],
    blend: 'screen', opacity: 0.8,
    gen: (w, h) => {
      const f = field(w, h, 280, 121, 4);
      return pixels(w, h, (i, _x, y, d) => {
        const a = sstep(0.35, 0.85, f[i]) * (0.4 + 0.6 * (y / h));
        set(d, i, 240, 45, 53, a * 200);
      });
    },
  },
];

const cache = new Map<string, HTMLCanvasElement>();

export function textureCanvas(id: string, w: number, h: number): HTMLCanvasElement | null {
  const def = TEXTURES.find((t) => t.id === id);
  if (!def) return null;
  // Large canvases are generated at reduced resolution and scaled when drawn.
  const k = Math.min(1, 2200 / Math.max(w, h));
  const W = Math.max(8, Math.round(w * k)), H = Math.max(8, Math.round(h * k));
  const key = `${id}:${W}x${H}`;
  let c = cache.get(key);
  if (!c) {
    c = def.gen(W, H);
    cache.set(key, c);
  }
  return c;
}

const thumbCache = new Map<string, string>();
export function textureThumb(id: string): string {
  let url = thumbCache.get(id);
  if (url) return url;
  const def = TEXTURES.find((t) => t.id === id)!;
  const c = mk(160, 160);
  const ctx = c.getContext('2d')!;
  const bg = ctx.createLinearGradient(0, 0, 160, 160);
  bg.addColorStop(0, '#F02D35');
  bg.addColorStop(1, '#390713');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 160, 160);
  ctx.globalCompositeOperation = def.blend;
  ctx.globalAlpha = Math.min(1, def.opacity + 0.2);
  ctx.drawImage(def.gen(320, 320), 0, 0, 160, 160);
  url = c.toDataURL();
  thumbCache.set(id, url);
  return url;
}
