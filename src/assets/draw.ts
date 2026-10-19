/** Reusable illustrated parts shared by several asset files. */
import { Art, C, Pt, circ, ell, line, rng, smooth, wob } from './style';

export function spiralPts(cx: number, cy: number, r: number, turns = 3, dir = 1): Pt[] {
  const out: Pt[] = [];
  const n = turns * 16;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const a = dir * t * turns * Math.PI * 2;
    out.push([cx + Math.cos(a) * r * t, cy + Math.sin(a) * r * t]);
  }
  return out;
}

export function spiralEye(a: Art, cx: number, cy: number, r: number, seed = 1, dir = 1) {
  a.shape(circ(cx, cy, r, 1.5, seed), C.paper, { sw: 6 });
  a.stroke(smooth(spiralPts(cx, cy, r * 0.82, 3, dir), false), Math.max(3, r * 0.13));
}

/** Capsule-shaped bone between two points with knuckle bulges. */
export function bonePath(x1: number, y1: number, x2: number, y2: number, w: number, seed = 1): string {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len, uy = dy / len, nx = -uy, ny = ux;
  const prof: [number, number][] = [
    [0, 0.55], [0.08, 0.62], [0.2, 0.42], [0.5, 0.36], [0.8, 0.42], [0.92, 0.62], [1, 0.55],
  ];
  const side = (s: number) => prof.map(([t, k]) => [x1 + ux * len * t + nx * w * k * s, y1 + uy * len * t + ny * w * k * s] as Pt);
  const capA: Pt = [x2 + ux * w * 0.35, y2 + uy * w * 0.35];
  const capB: Pt = [x1 - ux * w * 0.35, y1 - uy * w * 0.35];
  const pts = [...side(1), capA, ...side(-1).reverse(), capB];
  return wob(pts, 0.8, seed);
}

export function bone(a: Art, x1: number, y1: number, x2: number, y2: number, w: number, seed = 1, fill: string = C.bone) {
  a.shape(bonePath(x1, y1, x2, y2, w, seed), fill, { sw: Math.max(4, w * 0.22), shade: 0.45, shadeDx: -w * 0.25, shadeDy: -w * 0.25 });
}

/** Skull (front). Size ~ r = half width. */
export function skull(a: Art, cx: number, cy: number, r: number, seed = 3, fill: string = C.bone) {
  const pts: Pt[] = [
    [cx - r, cy - r * 0.05], [cx - r * 0.95, cy - r * 0.6], [cx - r * 0.6, cy - r * 0.98], [cx, cy - r * 1.1],
    [cx + r * 0.6, cy - r * 0.98], [cx + r * 0.95, cy - r * 0.6], [cx + r, cy - r * 0.05], [cx + r * 0.8, cy + r * 0.38],
    [cx + r * 0.52, cy + r * 0.5], [cx + r * 0.5, cy + r * 0.88], [cx, cy + r * 0.98], [cx - r * 0.5, cy + r * 0.88],
    [cx - r * 0.52, cy + r * 0.5], [cx - r * 0.8, cy + r * 0.38],
  ];
  a.shape(wob(pts, r * 0.025, seed), fill, { sw: Math.max(5, r * 0.08), shade: 0.5, shadeDx: -r * 0.28, shadeDy: -r * 0.18 });
  // eye sockets
  a.solid(wob(ell(cx - r * 0.42, cy + r * 0.02, r * 0.3, r * 0.27, 10), r * 0.03, seed + 1));
  a.solid(wob(ell(cx + r * 0.42, cy + r * 0.02, r * 0.3, r * 0.27, 10), r * 0.03, seed + 2));
  // nose
  a.solid(wob([[cx, cy + r * 0.3], [cx + r * 0.13, cy + r * 0.52], [cx - r * 0.13, cy + r * 0.52]], r * 0.01, seed));
  // teeth
  const tw = r * 0.2;
  for (let i = -2; i <= 2; i++) {
    a.stroke(line([[cx + i * tw * 0.9, cy + r * 0.66], [cx + i * tw * 0.9, cy + r * 0.88]], 0.5, seed + i), Math.max(3, r * 0.05));
  }
  a.stroke(line([[cx - r * 0.48, cy + r * 0.66], [cx + r * 0.48, cy + r * 0.66]], 1, seed), Math.max(3, r * 0.05));
  a.hi(line([[cx - r * 0.75, cy - r * 0.5], [cx - r * 0.45, cy - r * 0.82]], 1, seed), Math.max(3, r * 0.07));
}

/** Simple bat silhouette; wing = 'up' | 'down' | 'glide'. */
export function batPath(cx: number, cy: number, s: number, wing: 'up' | 'down' | 'glide', seed = 1): string {
  const wy = wing === 'up' ? -0.9 : wing === 'down' ? 0.55 : -0.15;
  const tip = wing === 'up' ? -1.05 : wing === 'down' ? 0.75 : -0.05;
  const half = (sgn: number): Pt[] => [
    [cx + sgn * 0.18 * s, cy - 0.15 * s],
    [cx + sgn * 0.55 * s, cy + (wy - 0.05) * s * 0.6],
    [cx + sgn * 1.0 * s, cy + tip * s * 0.7],
    [cx + sgn * 0.95 * s, cy + (tip + 0.35) * s * 0.6 + 0.1 * s],
    [cx + sgn * 0.78 * s, cy + (tip + 0.55) * s * 0.4 + 0.12 * s],
    [cx + sgn * 0.62 * s, cy + 0.22 * s + wy * 0.2 * s],
    [cx + sgn * 0.48 * s, cy + 0.14 * s + wy * 0.25 * s],
    [cx + sgn * 0.33 * s, cy + 0.3 * s + wy * 0.1 * s],
    [cx + sgn * 0.14 * s, cy + 0.2 * s],
  ];
  const r = half(1), l = half(-1).reverse();
  // head with ears on top centre
  const head: Pt[] = [
    [cx - 0.14 * s, cy - 0.15 * s], [cx - 0.13 * s, cy - 0.36 * s], [cx - 0.06 * s, cy - 0.24 * s],
    [cx + 0.06 * s, cy - 0.24 * s], [cx + 0.13 * s, cy - 0.36 * s], [cx + 0.14 * s, cy - 0.15 * s],
  ];
  const body: Pt[] = [[cx + 0.1 * s, cy + 0.32 * s], [cx, cy + 0.42 * s], [cx - 0.1 * s, cy + 0.32 * s]];
  const pts = [...head.slice(3), ...r, ...body, ...l, ...head.slice(0, 3)];
  const rr = rng(seed);
  return 'M' + pts.map(([x, y]) => `${(x + (rr() - 0.5) * s * 0.02).toFixed(1)} ${(y + (rr() - 0.5) * s * 0.02).toFixed(1)}`).join('L') + 'Z';
}

export function jackFace(a: Art, cx: number, cy: number, r: number, style: 'classic' | 'scary' | 'goofy', glow: string, seed = 1) {
  const eye = (sx: number) => {
    if (style === 'goofy') return wob(ell(cx + sx * r * 0.38, cy - r * 0.18, r * 0.16, r * 0.2, 10), 1.5, seed + sx);
    if (style === 'scary')
      return wob([[cx + sx * r * 0.12, cy - r * 0.12], [cx + sx * r * 0.62, cy - r * 0.36], [cx + sx * r * 0.5, cy - r * 0.02]], 1.5, seed + sx);
    return wob([[cx + sx * r * 0.38, cy - r * 0.42], [cx + sx * r * 0.6, cy - r * 0.06], [cx + sx * r * 0.16, cy - r * 0.06]], 1.5, seed + sx);
  };
  let mouth: string;
  if (style === 'classic') {
    mouth = wob([
      [cx - r * 0.62, cy + r * 0.12], [cx - r * 0.4, cy + r * 0.2], [cx - r * 0.32, cy + r * 0.1], [cx - r * 0.2, cy + r * 0.22],
      [cx, cy + r * 0.24], [cx + r * 0.2, cy + r * 0.22], [cx + r * 0.32, cy + r * 0.1], [cx + r * 0.4, cy + r * 0.2],
      [cx + r * 0.62, cy + r * 0.12], [cx + r * 0.4, cy + r * 0.5], [cx + r * 0.15, cy + r * 0.56], [cx + r * 0.05, cy + r * 0.44],
      [cx - r * 0.08, cy + r * 0.58], [cx - r * 0.4, cy + r * 0.5],
    ], 1, seed);
  } else if (style === 'scary') {
    const pts: Pt[] = [];
    const n = 8;
    for (let i = 0; i <= n; i++) pts.push([cx - r * 0.7 + (i * r * 1.4) / n, cy + r * (i % 2 ? 0.28 : 0.12) + Math.sin((i / n) * Math.PI) * r * 0.08]);
    for (let i = n; i >= 0; i--) pts.push([cx - r * 0.62 + (i * r * 1.24) / n, cy + r * (i % 2 ? 0.48 : 0.66) + Math.sin((i / n) * Math.PI) * r * 0.06]);
    mouth = 'M' + pts.map((p) => p.map((v) => v.toFixed(1)).join(' ')).join('L') + 'Z';
  } else {
    mouth = wob([...ell(cx, cy + r * 0.22, r * 0.5, r * 0.36, 12, 0.1, Math.PI - 0.1)], 1.5, seed);
  }
  const nose = wob([[cx, cy - r * 0.02], [cx + r * 0.1, cy + r * 0.12], [cx - r * 0.1, cy + r * 0.12]], 1, seed);
  for (const d of [eye(-1), eye(1), nose, mouth]) a.shape(d, glow, { sw: Math.max(4, r * 0.05), registered: true });
  // dark inner rim to suggest carved depth
  for (const d of [eye(-1), eye(1)]) a.raw(`<path d="${d}" fill="none" stroke="${C.burgundy}" stroke-width="${r * 0.08}" opacity=".55" transform="translate(${r * 0.03} ${r * 0.03})"/>`, 'fixed');
}

export function pumpkin(a: Art, cx: number, cy: number, rx: number, ry: number, seed = 1, fill: string = C.orange) {
  // stem
  a.shape(wob([[cx - rx * 0.08, cy - ry * 0.8], [cx - rx * 0.1, cy - ry * 1.12], [cx + rx * 0.02, cy - ry * 1.22], [cx + rx * 0.16, cy - ry * 1.18], [cx + rx * 0.08, cy - ry * 1.05], [cx + rx * 0.09, cy - ry * 0.8]], 1, seed), C.burgundy, { sw: 6 });
  const lobes = [-0.62, -0.25, 0.25, 0.62];
  // outer silhouette from lobes
  a.shape(wob(ell(cx, cy, rx, ry, 22), rx * 0.02, seed), fill, { sw: 8, shade: 0.5, shadeDx: -rx * 0.25, shadeDy: -ry * 0.18 });
  for (const l of lobes) {
    const x = cx + l * rx;
    a.stroke(line([[x, cy - ry * 0.85 * Math.sqrt(1 - l * l * 0.7)], [x + l * rx * 0.12, cy], [x, cy + ry * 0.88 * Math.sqrt(1 - l * l * 0.7)]], 1, seed + l * 10), 5, C.ink, 0.85);
  }
  a.hi(line([[cx - rx * 0.78, cy - ry * 0.25], [cx - rx * 0.62, cy - ry * 0.62]], 1, seed), 6);
}

export function cobwebLines(cx: number, cy: number, r: number, a0: number, a1: number, spokes = 6, rings = 5, seed = 1): string {
  const rr = rng(seed);
  let d = '';
  const angs: number[] = [];
  for (let i = 0; i < spokes; i++) angs.push(a0 + ((a1 - a0) * i) / (spokes - 1));
  for (const a of angs) d += `M${cx} ${cy}L${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)}`;
  for (let k = 1; k <= rings; k++) {
    const rad = (r * k) / (rings + 0.4);
    for (let i = 0; i < angs.length - 1; i++) {
      const p1 = [cx + Math.cos(angs[i]) * rad, cy + Math.sin(angs[i]) * rad];
      const p2 = [cx + Math.cos(angs[i + 1]) * rad, cy + Math.sin(angs[i + 1]) * rad];
      const mid = (angs[i] + angs[i + 1]) / 2;
      const sag = rad * (0.78 + rr() * 0.08);
      const q = [cx + Math.cos(mid) * sag, cy + Math.sin(mid) * sag];
      d += `M${p1[0].toFixed(1)} ${p1[1].toFixed(1)}Q${q[0].toFixed(1)} ${q[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
    }
  }
  return d;
}

export function flamePts(cx: number, by: number, w: number, h: number, seed = 1): Pt[] {
  const r = rng(seed);
  const tips = 5;
  const pts: Pt[] = [[cx - w / 2, by - h * 0.25]];
  for (let i = 0; i < tips; i++) {
    const t = (i + 0.5) / tips;
    const x = cx - w / 2 + w * t;
    const peak = h * (0.55 + 0.45 * Math.sin(t * Math.PI)) * (0.8 + r() * 0.3);
    pts.push([x - w / tips / 2 + w * 0.02, by - peak * 0.55]);
    pts.push([x + (r() - 0.5) * w * 0.08, by - peak]);
  }
  pts.push([cx + w / 2, by - h * 0.25]);
  pts.push([cx + w * 0.42, by - h * 0.05]);
  pts.push([cx, by]);
  pts.push([cx - w * 0.42, by - h * 0.05]);
  return pts;
}

export function speckles(a: Art, x: number, y: number, w: number, h: number, n: number, rmax: number, color: string, seed = 1) {
  const r = rng(seed);
  let d = '';
  for (let i = 0; i < n; i++) {
    const px = x + r() * w, py = y + r() * h, rad = 0.6 + r() * rmax;
    d += `M${(px - rad).toFixed(1)} ${py.toFixed(1)}a${rad.toFixed(1)} ${rad.toFixed(1)} 0 1 0 ${(rad * 2).toFixed(1)} 0a${rad.toFixed(1)} ${rad.toFixed(1)} 0 1 0 ${(-rad * 2).toFixed(1)} 0`;
  }
  a.solid(d, color);
}

export function splatPts(cx: number, cy: number, r: number, spikes: number, seed = 1): Pt[] {
  const rr = rng(seed);
  const pts: Pt[] = [];
  for (let i = 0; i < spikes * 2; i++) {
    const a = (i / (spikes * 2)) * Math.PI * 2;
    const rad = i % 2 ? r * (0.55 + rr() * 0.2) : r * (0.8 + rr() * 0.55);
    pts.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad]);
  }
  return pts;
}

/** Union of circles with a single continuous ink outline (clouds, smoke, foam). */
export function blobs(a: Art, list: [number, number, number][], fill: string, sw = 8, seed = 1, shade = 0.35) {
  list.forEach(([x, y, r], i) => a.solid(circ(x, y, r + sw / 2, r * 0.02, seed + i, 16)));
  a.next();
  list.forEach(([x, y, r], i) =>
    a.shape(circ(x, y, r - sw / 2, r * 0.02, seed + i, 16), fill, { ink: false, shade, shadeDx: -r * 0.25, shadeDy: -r * 0.3 }),
  );
}
