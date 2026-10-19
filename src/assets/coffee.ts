import type { Variant } from '../model/types';
import { blobs, spiralEye } from './draw';
import { Art, C, Pt, circ, ell, line, poly, rng, wob } from './style';
import type { SvgAsset } from './types';

const A = (
  id: string, name: string, group: string, tags: string, w: number, h: number,
  draw: (v: Variant) => string, insert?: number,
): SvgAsset => ({ kind: 'svg', id, name, cat: 'terownie', group, tags: tags.split(' '), w, h, draw, insert });

// ---------------------------------------------------------------- iced cups
type Brew = 'latte' | 'black' | 'caramel' | 'violet';

function cubes(a: Art, list: [number, number, number, number][], opacity = 0.85) {
  list.forEach(([x, y, s, rot], i) => {
    const pts: Pt[] = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([px, py]) => {
      const t = (rot * Math.PI) / 180;
      return [x + (px * Math.cos(t) - py * Math.sin(t)) * s, y + (px * Math.sin(t) + py * Math.cos(t)) * s] as Pt;
    });
    a.shape(wob(pts, s * 0.08, i + 3), '#DDEEF8', { sw: 5, opacity, shade: opacity === 1 ? 0.2 : false });
    a.hi(line([[x - s * 0.5, y - s * 0.6], [x + s * 0.2, y - s * 0.7]], 0.5, i), 4);
  });
}

function icedCup(brew: Brew) {
  return (v: Variant) => {
    const a = new Art();
    const top = 170, bot = 640, lt = 70, rt = 330, lb = 110, rb = 290;
    const lx = (y: number) => lt + ((lb - lt) * (y - top)) / (bot - top);
    const rx = (y: number) => rt + ((rb - rt) * (y - top)) / (bot - top);
    const cup = poly([[lt, top], [rt, top], [rb, bot], [lb, bot]], 1.5, 2);
    // straw behind lid
    a.shape(poly([[214, 10], [238, 4], [222, 200], [198, 200]], 1, 3), brew === 'violet' ? C.orange : C.scarlet, { sw: 6 });
    a.raw(`<path d="M206 40 L232 34 M204 80 L228 74 M202 120 L226 114" stroke="${C.paper}" stroke-width="7"/>`, 'top');
    a.next();
    // liquid
    const layers: Record<Brew, [number, string][]> = {
      latte: [[260, C.paper], [330, C.latte], [640, C.coffee]],
      black: [[230, '#3A1E10'], [640, '#2A140B']],
      caramel: [[250, C.cream], [360, C.caramel], [640, C.latte]],
      violet: [[260, C.paper], [380, '#9C6BD1'], [640, C.violet]],
    };
    let yPrev = 220;
    const r = rng(brew.length);
    for (const [yEnd, col] of layers[brew]) {
      const wave = (y: number) => {
        const pts: Pt[] = [];
        for (let i = 0; i <= 6; i++) {
          const x = lx(y) + ((rx(y) - lx(y)) * i) / 6;
          pts.push([x, y + Math.sin(i * 1.3 + r() * 2) * 8]);
        }
        return pts;
      };
      const t = wave(yPrev), b = wave(Math.min(yEnd, bot - 6)).reverse();
      a.raw(`<path d="${poly([...t, ...b], 0, 1)}" fill="${col}"/>`, 'fills');
      yPrev = yEnd;
    }
    if (brew === 'caramel') {
      for (const x of [110, 170, 240, 290]) a.raw(`<path d="${line([[x, 214], [x + 8, 300], [x - 6, 380], [x + 4, 470]], 4, x)}" stroke="${C.caramel}" stroke-width="12" fill="none" stroke-linecap="round"/>`, 'fills');
    }
    // halftone shade on right side of cup
    a.raw(`<path d="${poly([[rt - 70, top], [rt, top], [rb, bot], [rb - 60, bot]], 0, 1)}" fill="url(#ht)" opacity=".35"/>`, 'fills');
    cubes(a, [[150, 270, 34, 12], [240, 250, 30, -10], [200, 330, 30, 30]]);
    // cup outline + glass highlight
    a.stroke(cup, 9);
    a.raw(`<path d="${line([[96, 210], [120, 420], [130, 560]], 1, 2)}" stroke="${C.paper}" stroke-width="10" opacity=".75" fill="none" stroke-linecap="round"/>`, 'top');
    // condensation
    const rr = rng(7);
    for (let i = 0; i < 14; i++) {
      const y = 260 + rr() * 340, x = lx(y) + 20 + rr() * (rx(y) - lx(y) - 40);
      a.raw(`<ellipse cx="${x}" cy="${y}" rx="${3 + rr() * 3}" ry="${5 + rr() * 4}" fill="${C.paper}" opacity=".8"/>`, 'top');
    }
    // dome lid
    a.next();
    a.shape(wob([[40, 176], [52, 150], [360, 150], [362, 176], [200, 186]], 1, 5), '#E8F3FA', { sw: 8 });
    a.shape(wob([[70, 152], ...ell(200, 152, 130, 70, 14, Math.PI, Math.PI * 2).slice(1, -1), [330, 152]], 1.5, 6), '#E8F3FA', { sw: 8, opacity: 0.9 });
    a.raw(`<path d="${line([[100, 120], [140, 100]], 1, 1)}" stroke="${C.paper}" stroke-width="7" fill="none"/>`, 'top');
    // sleeve band for logo
    a.shape(poly([[lx(430) - 4, 430], [rx(430) + 4, 430], [rx(520) + 4, 520], [lx(520) - 4, 520]], 1.5, 8), C.cream, { sw: 7 });
    return a.render(v, 400, 660);
  };
}

function hotCup(v: Variant) {
  const a = new Art();
  for (const x of [150, 210, 270]) a.stroke(line([[x, 150], [x - 20, 110], [x + 10, 70], [x - 10, 30]], 2, x), 8, C.cream, 0.9);
  a.next();
  a.shape(poly([[80, 190], [320, 190], [290, 560], [110, 560]], 1.5, 1), C.paper, { sw: 9, shade: 0.4, shadeDx: -40 });
  a.shape(poly([[60, 160], [340, 160], [336, 200], [64, 200]], 1, 2), C.ink, { sw: 6 });
  a.shape(poly([[92, 300], [308, 300], [298, 440], [102, 440]], 1, 3), C.scarlet, { sw: 8 });
  a.raw(`<path d="${poly([[92, 300], [308, 300], [298, 440], [102, 440]], 1, 3)}" fill="url(#hatch)" opacity=".18"/>`, 'fills');
  return a.render(v, 400, 580);
}

// ---------------------------------------------------------------- splashes & ice
function splash(fill: string, seed: number) {
  return (v: Variant) => {
    const a = new Art();
    const r = rng(seed);
    const pts: Pt[] = [[30, 330], [80, 300]];
    const crowns = 7;
    for (let i = 0; i < crowns; i++) {
      const x = 90 + (i * 340) / (crowns - 1);
      const h = 120 + r() * 150 * Math.sin(((i + 0.5) / crowns) * Math.PI);
      pts.push([x - 26, 300 - h * 0.35], [x - 4, 300 - h], [x + 6, 300 - h + 6], [x + 26, 300 - h * 0.4]);
    }
    pts.push([470, 300], [520, 330], [400, 360], [270, 370], [140, 362]);
    a.shape(wob(pts, 3, seed), fill, { sw: 9, shade: 0.35, shadeDx: 0, shadeDy: -30 });
    for (let i = 0; i < 6; i++) {
      const x = 80 + r() * 380, y = 40 + r() * 80, s = 8 + r() * 14;
      a.shape(wob(ell(x, y, s, s * 1.3, 8), 1, i), fill, { sw: 5 });
    }
    a.hi(line([[110, 300], [150, 250]], 1, 2), 6);
    return a.render(v, 550, 390);
  };
}

function iceCube(v: Variant) {
  const a = new Art();
  a.shape(wob([[60, 110], [200, 50], [330, 110], [320, 280], [190, 350], [70, 280]], 3, 2), '#DDEEF8', { sw: 9 });
  a.stroke(line([[60, 110], [190, 170], [330, 110]], 1.5, 3), 6);
  a.stroke(line([[190, 170], [190, 350]], 1.5, 4), 6);
  a.raw(`<path d="${poly([[190, 170], [330, 110], [320, 280], [190, 350]], 1, 1)}" fill="url(#ht)" opacity=".2"/>`, 'fills');
  a.hi(line([[100, 140], [100, 230]], 1, 1), 9);
  a.hi(line([[150, 90], [220, 70]], 1, 2), 8);
  return a.render(v, 390, 390);
}

function iceTrio(v: Variant) {
  const a = new Art();
  cubes(a, [[110, 200, 80, 10], [290, 160, 70, -16], [220, 300, 60, 28]], 1);
  return a.render(v, 400, 380);
}

function condensation(v: Variant) {
  const a = new Art();
  const r = rng(12);
  for (let i = 0; i < 60; i++) {
    const x = r() * 600, y = r() * 600, s = 4 + r() * 16;
    const d = wob([[x, y - s * 1.4], [x + s, y], [x, y + s], [x - s, y]], 0.5, i);
    a.raw(`<path d="${d}" fill="${C.paper}" opacity=".55"/><path d="${d}" fill="none" stroke="${C.ink}" stroke-width="2" opacity=".35"/><circle cx="${x - s * 0.3}" cy="${y - s * 0.2}" r="${s * 0.25}" fill="#fff"/>`, 'inks');
  }
  return a.render(v, 600, 600);
}

function bean(a: Art, x: number, y: number, s: number, rot: number, seed: number) {
  const t = (rot * Math.PI) / 180;
  const tr = (p: Pt): Pt => [x + p[0] * Math.cos(t) - p[1] * Math.sin(t), y + p[0] * Math.sin(t) + p[1] * Math.cos(t)];
  a.shape(wob(ell(0, 0, s * 0.72, s, 12).map(tr), s * 0.03, seed), C.coffee, { sw: Math.max(4, s * 0.09), shade: 0.45, shadeDx: -s * 0.2, shadeDy: -s * 0.2 });
  a.stroke(line([[0, -s * 0.85], [s * 0.15, -s * 0.3], [-s * 0.12, s * 0.3], [0, s * 0.85]].map((p) => tr(p as Pt)), 0.5, seed), Math.max(4, s * 0.1));
  a.hi(line([[-s * 0.45, -s * 0.4], [-s * 0.3, -s * 0.7]].map((p) => tr(p as Pt)), 0.3, seed), Math.max(3, s * 0.07), C.latte);
}

function beanAsset(v: Variant) {
  const a = new Art();
  bean(a, 150, 170, 120, 20, 1);
  return a.render(v, 300, 340);
}

function beanPile(v: Variant) {
  const a = new Art();
  const list: [number, number, number, number][] = [[90, 200, 60, -30], [190, 210, 64, 40], [290, 200, 58, 80], [140, 120, 56, 10], [240, 120, 60, -50], [190, 50, 50, 20]];
  list.forEach(([x, y, s, r], i) => { bean(a, x, y, s, r, i + 2); a.next(); });
  return a.render(v, 380, 280);
}

function caramelDrip(v: Variant) {
  const a = new Art();
  const r = rng(21);
  const pts: Pt[] = [[0, 0], [800, 0], [800, 40]];
  let x = 800;
  while (x > 0) {
    const w = 50 + r() * 60, len = 20 + r() * 120;
    pts.push([x - w * 0.15, 44], [x - w * 0.3, 50 + len * 0.6], [x - w * 0.42, 50 + len], [x - w * 0.5, 62 + len], [x - w * 0.58, 50 + len], [x - w * 0.7, 50 + len * 0.6], [x - w * 0.85, 44]);
    x -= w;
  }
  pts.push([0, 40]);
  a.shape(wob(pts, 1, 2), C.caramel, { sw: 7, shade: 0.3, shadeDx: 8, shadeDy: -12 });
  a.hi('M20 18 L300 16', 6, '#F9C27A');
  return a.render(v, 800, 240);
}

// ---------------------------------------------------------------- treats
function cookie(v: Variant) {
  const a = new Art();
  a.shape(wob(ell(200, 200, 170, 160, 18), 7, 4), '#D9A05B', { sw: 9, shade: 0.45, shadeDx: -40, shadeDy: -30 });
  const r = rng(5);
  for (let i = 0; i < 9; i++) {
    const t = r() * Math.PI * 2, d = r() * 120;
    a.shape(wob(ell(200 + Math.cos(t) * d, 200 + Math.sin(t) * d, 16 + r() * 8, 12 + r() * 6, 7), 2, i), '#3A1E10', { sw: 4 });
  }
  a.hi(line([[80, 140], [110, 90]], 1, 1), 6, '#F2C58A');
  return a.render(v, 400, 400);
}

function biscuit(v: Variant) {
  const a = new Art();
  a.shape(wob([[44, 56], [356, 56], [360, 250], [40, 250]], 3, 3), '#E3AE63', { sw: 9, shade: 0.4, shadeDx: -30, shadeDy: -20 });
  a.stroke(poly([[56, 76], [344, 76], [348, 234], [52, 234]], 1.5, 4), 4, C.burgundy, 0.7);
  for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) a.solid(circ(110 + i * 60, 130 + j * 50, 6, 0.5, i + j * 4), C.burgundy);
  return a.render(v, 400, 300);
}

function whippedCream(v: Variant) {
  const a = new Art();
  blobs(a, [[100, 300, 70], [200, 300, 80], [300, 300, 70], [150, 220, 66], [250, 220, 66], [200, 150, 58], [210, 90, 40]], C.paper, 9, 3, 0.3);
  a.stroke(line([[90, 290], [150, 270], [210, 300], [280, 270]], 1.5, 2), 4, C.ink, 0.7);
  a.stroke(line([[150, 210], [200, 190], [250, 214]], 1.5, 3), 4, C.ink, 0.7);
  a.raw(`<path d="${wob([[205, 50], [218, 40], [228, 60]], 1, 1)}" fill="${C.scarlet}" stroke="${C.ink}" stroke-width="5"/>`, 'top');
  return a.render(v, 400, 390);
}

function milkSwirl(v: Variant) {
  const a = new Art();
  a.shape(circ(200, 200, 180, 2, 3, 22), C.coffee, { sw: 10 });
  a.shape(circ(200, 200, 150, 2, 4, 22), C.latte, { sw: 4 });
  const pts: Pt[] = [];
  for (let i = 0; i <= 60; i++) {
    const t = i / 60, ang = t * Math.PI * 5;
    pts.push([200 + Math.cos(ang) * 120 * t, 200 + Math.sin(ang) * 110 * t]);
  }
  a.stroke(wob(pts, 0, 1, false), 16, C.paper);
  a.stroke(wob(pts, 0, 1, false), 3, C.ink, 0.5);
  return a.render(v, 400, 400);
}

// ---------------------------------------------------------------- booth, menu, counter
function menuBoard(v: Variant) {
  const a = new Art();
  a.stroke(line([[90, 560], [130, 380]], 1, 1), 14);
  a.stroke(line([[410, 560], [370, 380]], 1, 2), 14);
  a.next();
  a.shape(poly([[40, 30], [460, 30], [460, 420], [40, 420]], 2, 3), C.burgundy, { sw: 11 });
  a.shape(poly([[70, 60], [430, 60], [430, 390], [70, 390]], 2, 4), '#231A22', { sw: 6 });
  a.raw(`<path d="${poly([[70, 60], [430, 60], [430, 390], [70, 390]], 2, 4)}" fill="url(#htc)" opacity=".07"/>`, 'top');
  a.stroke(line([[100, 110], [400, 108]], 2, 5), 3, C.cream, 0.35);
  a.stroke(line([[100, 340], [400, 342]], 2, 6), 3, C.cream, 0.35);
  return a.render(v, 500, 580);
}

function popupBooth(v: Variant) {
  const a = new Art();
  // posts
  a.shape(poly([[70, 230], [94, 230], [94, 640], [70, 640]], 1, 1), C.burgundy, { sw: 7 });
  a.shape(poly([[606, 230], [630, 230], [630, 640], [606, 640]], 1, 2), C.burgundy, { sw: 7 });
  a.next();
  // sign board (blank for the logo)
  a.shape(poly([[180, 20], [520, 20], [520, 130], [180, 130]], 2, 3), C.navy, { sw: 9 });
  a.shape(poly([[200, 38], [500, 38], [500, 112], [200, 112]], 1, 4), C.cream, { sw: 5 });
  a.stroke(line([[230, 130], [230, 170]], 0.5, 1), 6);
  a.stroke(line([[470, 130], [470, 170]], 0.5, 2), 6);
  a.next();
  // awning stripes
  const n = 8, x0 = 30, x1 = 670, yT = 170, yB = 260;
  for (let i = 0; i < n; i++) {
    const xa = x0 + ((x1 - x0) * i) / n, xb = x0 + ((x1 - x0) * (i + 1)) / n;
    const col = i % 2 ? C.cream : C.scarlet;
    a.raw(`<path d="${poly([[xa + 20 - i * 2, yT], [xb + 20 - (i + 1) * 2, yT], [xb, yB], [xa, yB]], 0, i)}" fill="${col}"/>`, 'fills');
  }
  // scallops
  for (let i = 0; i < n; i++) {
    const xa = x0 + ((x1 - x0) * i) / n, xb = x0 + ((x1 - x0) * (i + 1)) / n;
    const col = i % 2 ? C.cream : C.scarlet;
    a.shape(wob([[xa, yB], ...ell((xa + xb) / 2, yB, (xb - xa) / 2, 34, 8, 0, Math.PI).reverse(), [xb, yB]], 0.5, i), col, { sw: 6 });
  }
  a.stroke(poly([[x0 + 20, yT], [x1 + 4, yT], [x1, yB], [x0, yB]], 1.5, 5), 8);
  a.next();
  // counter
  a.shape(poly([[40, 470], [660, 470], [660, 500], [40, 500]], 1.5, 6), C.ink, { sw: 6 });
  a.shape(poly([[60, 500], [640, 500], [640, 680], [60, 680]], 2, 7), C.burgundy, { sw: 9, shade: 0.5, shadeDx: -40, shadeDy: 0 });
  a.shape(poly([[200, 530], [500, 530], [500, 650], [200, 650]], 1.5, 8), C.cream, { sw: 6 });
  // bats bunting
  for (let i = 0; i < 7; i++) {
    const x = 110 + i * 80;
    a.shape(poly([[x - 26, 306], [x + 26, 306], [x, 346]], 1, i), i % 2 ? C.orange : C.violet, { sw: 5 });
  }
  a.stroke(line([[80, 300], [300, 316], [620, 300]], 1, 9), 4);
  // cups on counter
  for (const [x, c] of [[140, C.latte], [210, C.coffee], [520, C.caramel]] as [number, string][]) {
    a.shape(poly([[x - 26, 400], [x + 26, 400], [x + 20, 470], [x - 20, 470]], 1, x), c, { sw: 6 });
    a.shape(wob([[x - 30, 400], ...ell(x, 400, 30, 22, 6, Math.PI, Math.PI * 2).slice(1, -1), [x + 30, 400]], 0.5, x), '#E8F3FA', { sw: 6 });
  }
  return a.render(v, 700, 700);
}

function coffeeCounter(v: Variant) {
  const a = new Art();
  // espresso machine
  a.shape(poly([[240, 60], [480, 60], [480, 300], [240, 300]], 2, 1), C.scarlet, { sw: 9, shade: 0.45, shadeDx: -30 });
  a.shape(poly([[230, 40], [490, 40], [490, 70], [230, 70]], 1, 2), C.ink, { sw: 5 });
  a.shape(circ(300, 140, 26, 1, 3), C.cream, { sw: 6 });
  a.shape(circ(420, 140, 26, 1, 4), C.cream, { sw: 6 });
  a.stroke('M300 140 L312 124 M420 140 L408 124', 4);
  a.shape(poly([[300, 220], [420, 220], [410, 250], [310, 250]], 1, 5), C.ink, { sw: 5 });
  a.shape(poly([[330, 260], [390, 260], [384, 298], [336, 298]], 1, 6), C.paper, { sw: 5 });
  a.next();
  // grinder
  a.shape(poly([[560, 120], [640, 60], [680, 120], [660, 300], [580, 300]], 2, 7), C.navy, { sw: 8 });
  a.next();
  a.shape(poly([[20, 300], [780, 300], [780, 340], [20, 340]], 1.5, 8), C.ink, { sw: 6 });
  a.shape(poly([[40, 340], [760, 340], [760, 520], [40, 520]], 2, 9), C.burgundy, { sw: 9, shade: 0.5, shadeDx: -50, shadeDy: 0 });
  for (let i = 0; i < 6; i++) a.stroke(line([[60 + i * 120, 360], [60 + i * 120, 500]], 1, i), 4, C.ink, 0.6);
  // pastry dome
  a.shape(poly([[60, 300], [190, 300], [180, 280], [70, 280]], 1, 10), C.cream, { sw: 6 });
  a.shape(wob([[70, 280], ...ell(125, 280, 56, 70, 10, Math.PI, Math.PI * 2).slice(1, -1), [180, 280]], 1, 11), '#E8F3FA', { sw: 6, opacity: 0.6 });
  a.shape(wob(ell(125, 262, 34, 16, 8), 1, 12), '#D9A05B', { sw: 4 });
  return a.render(v, 800, 540);
}

// ---------------------------------------------------------------- expressions (parts to put on mascots / cups)
function face(kind: 'sleepy' | 'spiral' | 'blush' | 'shock') {
  return (v: Variant) => {
    const a = new Art();
    if (kind === 'spiral') {
      spiralEye(a, 90, 90, 56, 1, 1);
      spiralEye(a, 250, 90, 56, 2, -1);
      a.stroke(line([[130, 190], [150, 178], [170, 192], [190, 178], [210, 190]], 1, 3), 7);
    } else if (kind === 'sleepy') {
      a.stroke(line([[40, 90], [90, 112], [140, 90]], 1, 1), 10);
      a.stroke(line([[200, 90], [250, 112], [300, 90]], 1, 2), 10);
      a.shape(wob(ell(170, 180, 16, 20, 8), 1, 3), C.ink, { sw: 4 });
      a.raw(`<path d="${wob([[150, 140], [160, 120], [168, 140], [158, 150]], 0.5, 1)}" fill="#BFE0F5" stroke="${C.ink}" stroke-width="4"/>`, 'top');
    } else if (kind === 'shock') {
      a.shape(circ(90, 90, 40, 1, 1), C.paper, { sw: 8 });
      a.shape(circ(250, 90, 40, 1, 2), C.paper, { sw: 8 });
      a.solid(circ(90, 94, 10, 0.5, 3)); a.solid(circ(250, 94, 10, 0.5, 4));
      a.shape(wob(ell(170, 190, 22, 30, 8), 1, 5), C.ink, { sw: 5 });
    } else {
      a.solid(wob(ell(90, 90, 22, 30, 8), 1, 1)); a.solid(wob(ell(250, 90, 22, 30, 8), 1, 2));
      a.hiFill(circ(84, 78, 8, 0.4, 1)); a.hiFill(circ(244, 78, 8, 0.4, 2));
      a.stroke(line([[140, 160], [170, 186], [200, 160]], 0.8, 3), 8);
    }
    a.raw(`<ellipse cx="50" cy="160" rx="34" ry="16" fill="url(#htr)"/><ellipse cx="290" cy="160" rx="34" ry="16" fill="url(#htr)"/>`, 'top');
    return a.render(v, 340, 230);
  };
}

// ---------------------------------------------------------------- sticker frames (for the real logo)
function stickerRound(v: Variant) {
  const a = new Art();
  a.raw(`<circle cx="214" cy="218" r="196" fill="${C.ink}" opacity=".9"/>`, 'fills');
  a.shape(circ(200, 200, 190, 1.5, 1, 26), C.paper, { sw: 7 });
  a.shape(circ(200, 200, 160, 1.5, 2, 26), C.scarlet, { sw: 6 });
  a.shape(circ(200, 200, 132, 1.5, 3, 24), C.cream, { sw: 5 });
  return a.render(v, 420, 420);
}

function stickerTicket(v: Variant) {
  const a = new Art();
  const d = poly([[20, 40], [560, 40], [560, 110], [540, 140], [560, 170], [560, 240], [20, 240], [20, 170], [40, 140], [20, 110]], 1.5, 3);
  a.raw(`<path d="${d}" fill="${C.ink}" transform="translate(10 10)"/>`, 'fills');
  a.shape(d, C.paper, { sw: 8 });
  a.shape(poly([[50, 66], [530, 66], [530, 214], [50, 214]], 1.5, 4), C.navy, { sw: 5 });
  return a.render(v, 590, 270);
}

export const COFFEE: SvgAsset[] = [
  A('iced-latte', 'Iced Latte Cup', 'Iced Coffee', 'iced coffee latte cup drink straw', 400, 660, icedCup('latte'), 420),
  A('iced-black', 'Iced Black Coffee', 'Iced Coffee', 'iced coffee black americano cup', 400, 660, icedCup('black'), 420),
  A('iced-caramel', 'Caramel Iced Cup', 'Iced Coffee', 'iced caramel coffee cup drizzle', 400, 660, icedCup('caramel'), 420),
  A('iced-violet', 'Violet Iced Cup', 'Iced Coffee', 'iced violet purple drink cup', 400, 660, icedCup('violet'), 420),
  A('hot-cup', 'Hot Cup & Steam', 'Iced Coffee', 'hot coffee cup steam', 400, 580, hotCup, 340),
  A('coffee-splash', 'Coffee Splash', 'Splashes & Ice', 'coffee splash crown liquid', 550, 390, splash(C.coffee, 4), 460),
  A('milk-splash', 'Milk Splash', 'Splashes & Ice', 'milk cream splash crown', 550, 390, splash(C.paper, 9), 460),
  A('ice-cube', 'Ice Cube', 'Splashes & Ice', 'ice cube cold', 390, 390, iceCube, 160),
  A('ice-trio', 'Ice Cubes', 'Splashes & Ice', 'ice cubes cold three', 400, 380, iceTrio, 240),
  A('condensation', 'Condensation Drops', 'Splashes & Ice', 'condensation droplets water drops cold', 600, 600, condensation, 400),
  A('coffee-bean', 'Coffee Bean', 'Beans & Drips', 'coffee bean', 300, 340, beanAsset, 120),
  A('bean-pile', 'Coffee Bean Pile', 'Beans & Drips', 'coffee beans pile', 380, 280, beanPile, 260),
  A('caramel-drip', 'Caramel Drip Strip', 'Beans & Drips', 'caramel drip strip border syrup', 800, 240, caramelDrip, 1080),
  A('cookie', 'Choc-Chip Cookie', 'Treats', 'cookie chocolate chip biscuit', 400, 400, cookie, 200),
  A('biscuit', 'Biscuit', 'Treats', 'biscuit cracker', 400, 300, biscuit, 200),
  A('whipped-cream', 'Whipped Cream', 'Treats', 'whipped cream swirl topping', 400, 390, whippedCream, 260),
  A('milk-swirl', 'Latte Swirl (Top View)', 'Treats', 'latte art milk swirl top', 400, 400, milkSwirl, 260),
  A('menu-board', 'Blank Menu Board', 'Booth & Counter', 'menu board chalkboard frame sign', 500, 580, menuBoard, 380),
  A('popup-booth', 'Pop-Up Booth', 'Booth & Counter', 'booth popup stall awning stand', 700, 700, popupBooth, 640),
  A('coffee-counter', 'Coffee Counter', 'Booth & Counter', 'counter espresso machine bar', 800, 540, coffeeCounter, 640),
  A('face-sleepy', 'Sleepy Face', 'Expressions', 'face sleepy tired cute expression', 340, 230, face('sleepy'), 220),
  A('face-spiral', 'Spiral-Eye Face', 'Expressions', 'face spiral eyes dizzy expression', 340, 230, face('spiral'), 220),
  A('face-blush', 'Happy Blush Face', 'Expressions', 'face cute blush happy expression', 340, 230, face('blush'), 220),
  A('face-shock', 'Shocked Face', 'Expressions', 'face shocked scared expression', 340, 230, face('shock'), 220),
  A('sticker-round', 'Round Sticker Frame', 'Sticker Frames', 'sticker frame round logo badge', 420, 420, stickerRound, 300),
  A('sticker-ticket', 'Ticket Sticker Frame', 'Sticker Frames', 'sticker frame ticket logo', 590, 270, stickerTicket, 420),
];
