import type { Variant } from '../model/types';
import { bone, skull, spiralEye } from './draw';
import { Art, C, Pt, circ, ell, line, poly, smooth, wob } from './style';
import type { SvgAsset } from './types';

const A = (
  id: string, name: string, group: string, tags: string, w: number, h: number,
  draw: (v: Variant) => string, insert?: number,
): SvgAsset => ({ kind: 'svg', id, name, cat: 'characters', group, tags: tags.split(' '), w, h, draw, insert });

// ---------------------------------------------------------------- ghosts
type GhostFace = 'boo' | 'scream' | 'spiral' | 'grin' | 'sleepy';

function ghost(face: GhostFace, seed: number, tilt = 0) {
  return (v: Variant) => {
    const a = new Art();
    const body: Pt[] = [
      [100, 345], [92, 265], [96, 185], [118, 112], [158, 64], [205, 50], [250, 64], [290, 112], [312, 185],
      [316, 265], [310, 345], [286, 372], [262, 344], [236, 374], [210, 346], [184, 376], [158, 346], [130, 372],
    ];
    const rot = (p: Pt): Pt => {
      const t = (tilt * Math.PI) / 180, cx = 205, cy = 220;
      const dx = p[0] - cx, dy = p[1] - cy;
      return [cx + dx * Math.cos(t) - dy * Math.sin(t), cy + dx * Math.sin(t) + dy * Math.cos(t)];
    };
    // arms
    a.shape(wob([[104, 190], [58, 150], [44, 162], [70, 214], [100, 236]].map(rot), 2, seed + 3), C.paper, { sw: 8 });
    a.shape(wob([[306, 190], [352, 150], [366, 162], [340, 214], [310, 236]].map(rot), 2, seed + 4), C.paper, { sw: 8 });
    a.next();
    a.shape(wob(body.map(rot), 3, seed), C.paper, { sw: 9, shade: 0.5, shadeDx: -30, shadeDy: -8 });
    const [ex, ey] = rot([205, 175]);
    if (face === 'spiral') {
      spiralEye(a, ex - 45, ey, 30, seed, 1);
      spiralEye(a, ex + 45, ey, 30, seed + 1, -1);
      a.shape(wob(ell(ex, ey + 72, 22, 16, 10, 0, Math.PI), 1.5, seed), C.ink, { sw: 6 });
    } else if (face === 'sleepy') {
      a.stroke(line([[ex - 70, ey + 4], [ex - 45, ey + 16], [ex - 20, ey + 4]], 1, seed), 8);
      a.stroke(line([[ex + 20, ey + 4], [ex + 45, ey + 16], [ex + 70, ey + 4]], 1, seed), 8);
      a.shape(circ(ex, ey + 70, 12, 1, seed), C.ink, { sw: 4 });
      a.raw(`<text x="${ex + 70}" y="${ey - 50}" font-family="Arial Black,Impact,sans-serif" font-weight="900" font-size="40" fill="${C.navy}" stroke="${C.ink}" stroke-width="3">z</text><text x="${ex + 100}" y="${ey - 82}" font-family="Arial Black,Impact,sans-serif" font-weight="900" font-size="28" fill="${C.navy}" stroke="${C.ink}" stroke-width="2.5">z</text>`, 'top');
    } else {
      const eh = face === 'scream' ? 40 : 32;
      a.solid(wob(ell(ex - 42, ey, 22, eh, 10), 1.5, seed + 5));
      a.solid(wob(ell(ex + 42, ey, 22, eh, 10), 1.5, seed + 6));
      a.hiFill(circ(ex - 48, ey - 12, 7, 0.5, seed));
      a.hiFill(circ(ex + 36, ey - 12, 7, 0.5, seed + 1));
      if (face === 'scream') {
        a.stroke(line([[ex - 72, ey - 58], [ex - 30, ey - 44]], 1, seed), 9);
        a.stroke(line([[ex + 72, ey - 58], [ex + 30, ey - 44]], 1, seed), 9);
        a.shape(wob(ell(ex, ey + 92, 26, 48, 12), 2, seed), C.ink, { sw: 6 });
        a.raw(`<path d="${wob(ell(ex, ey + 118, 16, 16, 8, 0, Math.PI), 1, seed)}" fill="${C.scarlet}"/>`, 'top');
      } else if (face === 'grin') {
        const pts: Pt[] = [];
        for (let i = 0; i <= 10; i++) pts.push([ex - 70 + i * 14, ey + 56 + (i % 2 ? 16 : 0) + Math.sin((i / 10) * Math.PI) * 18]);
        a.shape(smooth([[ex - 74, ey + 50], ...ell(ex, ey + 54, 74, 46, 12, 0.05, Math.PI - 0.05)].reverse(), true), C.ink, { sw: 6 });
        a.raw(`<path d="${poly(pts, 0, 1, false)}" fill="none" stroke="${C.paper}" stroke-width="7" stroke-linejoin="bevel"/>`, 'top');
      } else {
        a.shape(wob(ell(ex, ey + 78, 22, 26, 10), 1.5, seed), C.ink, { sw: 6 });
        a.raw(`<path d="${wob(ell(ex, ey + 92, 12, 10, 8, 0, Math.PI), 1, seed)}" fill="${C.scarlet}"/>`, 'top');
      }
      // blush
      a.raw(`<ellipse cx="${ex - 82}" cy="${ey + 46}" rx="20" ry="10" fill="url(#htr)"/><ellipse cx="${ex + 82}" cy="${ey + 46}" rx="20" ry="10" fill="url(#htr)"/>`, 'top');
    }
    a.hi(line([[130, 150], [150, 108], [178, 84]].map(rot), 1, seed), 7);
    return a.render(v, 410, 400);
  };
}

function peekGhost(v: Variant) {
  const a = new Art();
  a.shape(wob([[40, 300], [44, 200], [80, 120], [150, 84], [220, 120], [256, 200], [260, 300]], 3, 4), C.paper, { sw: 9, shade: 0.5, shadeDx: -26, shadeDy: -6 });
  a.shape(wob([[30, 292], [92, 230], [120, 248], [76, 300]], 2, 5), C.paper, { sw: 8 });
  a.shape(wob([[270, 292], [208, 230], [180, 248], [224, 300]], 2, 6), C.paper, { sw: 8 });
  a.solid(wob(ell(118, 186, 18, 26, 10), 1, 2));
  a.solid(wob(ell(184, 186, 18, 26, 10), 1, 3));
  a.hiFill(circ(112, 176, 6, 0.4, 1));
  a.hiFill(circ(178, 176, 6, 0.4, 2));
  a.raw(`<rect x="0" y="292" width="300" height="20" fill="${C.ink}"/>`, 'inks');
  return a.render(v, 300, 312);
}

// ---------------------------------------------------------------- pumpkin head character
function pumpkinHead(v: Variant) {
  const a = new Art();
  // legs
  a.shape(wob([[150, 470], [140, 560], [118, 584], [172, 586], [182, 470]], 2, 3), C.ink, { sw: 6 });
  a.shape(wob([[218, 470], [226, 560], [248, 584], [196, 586], [192, 470]], 2, 4), C.ink, { sw: 6 });
  a.next();
  // torso / jacket
  a.shape(wob([[120, 290], [100, 380], [132, 480], [252, 480], [282, 380], [262, 290], [218, 270], [164, 270]], 3, 2), C.burgundy, { sw: 8, shade: 0.55, shadeDx: -24 });
  a.shape(wob([[176, 272], [192, 360], [206, 272]], 1, 9), C.cream, { sw: 6 });
  a.shape(wob([[183, 290], [192, 302], [201, 290], [192, 282]], 0.5, 1), C.scarlet, { sw: 4 });
  a.next();
  // arms waving
  a.shape(wob([[124, 300], [70, 240], [54, 186], [74, 180], [100, 230], [148, 286]], 2, 6), C.burgundy, { sw: 8 });
  a.shape(circ(62, 174, 18, 1.5, 7), C.cream, { sw: 6 });
  a.shape(wob([[260, 300], [306, 360], [312, 420], [292, 422], [282, 372], [240, 326]], 2, 8), C.burgundy, { sw: 8 });
  a.shape(circ(302, 432, 17, 1.5, 9), C.cream, { sw: 6 });
  a.next();
  // pumpkin head
  a.shape(wob([[180, 112], [176, 72], [196, 58], [212, 66], [198, 76], [200, 112]], 1, 2), C.burgundy, { sw: 6 });
  a.next();
  a.shape(wob(ell(192, 190, 118, 88, 22), 2.5, 5), C.orange, { sw: 9, shade: 0.5, shadeDx: -30, shadeDy: -16 });
  for (const l of [-0.6, -0.22, 0.22, 0.6]) a.stroke(line([[192 + l * 118, 112 + Math.abs(l) * 30], [192 + l * 132, 190], [192 + l * 118, 268 - Math.abs(l) * 30]], 1, l * 9), 5, C.ink, 0.8);
  a.shape(wob([[130, 168], [170, 150], [168, 192]], 1, 3), C.ink, { sw: 4, registered: true });
  a.shape(wob([[254, 168], [214, 150], [216, 192]], 1, 4), C.ink, { sw: 4, registered: true });
  a.raw(`<path d="${wob([[146, 170], [162, 162], [161, 182]], 0.5, 2)}" fill="${C.cream}"/><path d="${wob([[238, 170], [222, 162], [223, 182]], 0.5, 2)}" fill="${C.cream}"/>`, 'top');
  const m: Pt[] = [];
  for (let i = 0; i <= 8; i++) m.push([128 + i * 16, 220 + (i % 2 ? 14 : 0) + Math.sin((i / 8) * Math.PI) * 14]);
  for (let i = 8; i >= 0; i--) m.push([132 + i * 15, 242 + (i % 2 ? 0 : 12) + Math.sin((i / 8) * Math.PI) * 22]);
  a.shape(poly(m, 0.5, 3), C.ink, { sw: 4, registered: true });
  a.hi(line([[100, 168], [118, 130]], 1, 3), 7);
  return a.render(v, 380, 600);
}

// ---------------------------------------------------------------- silhouettes
function hoodedStalker(v: Variant) {
  const a = new Art();
  const pts: Pt[] = [
    [150, 40], [196, 60], [222, 120], [226, 190], [260, 230], [300, 300], [320, 420], [334, 560], [300, 580], [70, 580],
    [60, 470], [70, 330], [100, 230], [92, 140], [108, 76],
  ];
  const d = wob(pts, 3, 7);
  a.raw(`<path d="${d}" fill="${C.scarlet}" transform="translate(9 0)"/>`, 'fills');
  a.solid(d);
  // knife held low
  a.shape(wob([[300, 404], [314, 400], [322, 470], [306, 472]], 0.5, 2), C.ink, { sw: 4 });
  a.shape(poly([[306, 470], [324, 468], [330, 560], [318, 590], [308, 560]], 0, 1), C.cream, { sw: 5 });
  a.hi(line([[318, 486], [320, 560]], 0.4, 1), 3, C.paper);
  // face void inside hood
  a.raw(`<path d="${wob([[132, 110], [176, 108], [194, 170], [168, 216], [128, 196], [118, 150]], 2, 3)}" fill="${C.burgundy}" opacity=".9"/>`, 'top');
  a.raw(`<ellipse cx="143" cy="160" rx="7" ry="4" fill="${C.scarlet}"/><ellipse cx="172" cy="160" rx="7" ry="4" fill="${C.scarlet}"/>`, 'top');
  return a.render(v, 360, 600);
}

function vampire(v: Variant) {
  const a = new Art();
  const cape = wob([[200, 150], [300, 190], [380, 300], [372, 520], [330, 470], [290, 540], [250, 480], [200, 560], [150, 480], [110, 540], [70, 470], [28, 520], [20, 300], [100, 190]], 3, 2);
  a.raw(`<path d="${cape}" fill="${C.blood}" transform="translate(10 6)"/>`, 'fills');
  a.solid(cape);
  a.raw(`<path d="${wob([[140, 200], [200, 260], [260, 200], [300, 360], [200, 420], [100, 360]], 2, 4)}" fill="${C.scarlet}"/>`, 'inks');
  // collar spikes and head
  a.solid(wob([[110, 190], [70, 80], [150, 160], [200, 130], [250, 160], [330, 80], [290, 190]], 2, 5));
  a.solid(wob([[160, 160], [158, 100], [176, 60], [200, 44], [224, 60], [242, 100], [240, 160], [200, 180]], 2, 6));
  a.solid(wob([[180, 50], [200, 84], [220, 50], [200, 34]], 1, 2));
  a.raw(`<path d="M178 112 l14 6 -14 4z M222 112 l-14 6 14 4z" fill="${C.scarlet}"/>`, 'top');
  return a.render(v, 400, 570);
}

function witch(v: Variant) {
  const a = new Art();
  const broom = 'M20 330 L380 230';
  a.stroke(broom, 12);
  a.solid(wob([[350, 236], [430, 190], [446, 230], [440, 270], [362, 252]], 3, 2));
  a.raw(`<path d="${line([[372, 240], [440, 206]], 1, 2)}M376 246 L444 232M372 252 L436 262" stroke="${C.orange}" stroke-width="3" fill="none"/>`, 'top');
  const body = wob([[150, 300], [130, 220], [160, 170], [200, 160], [230, 200], [262, 270], [320, 300], [250, 320], [200, 290], [180, 330], [120, 360], [140, 320]], 3, 4);
  a.raw(`<path d="${body}" fill="${C.violet}" transform="translate(8 5)"/>`, 'fills');
  a.solid(body);
  a.solid(wob([[176, 168], [168, 130], [190, 118], [214, 134], [208, 170]], 1.5, 5));
  a.solid(poly([[130, 132], [176, 30], [186, 20], [196, 34], [190, 60], [252, 124], [222, 140], [140, 146]], 1, 6));
  a.solid(wob([[230, 200], [290, 240], [300, 230], [244, 186]], 1, 7));
  return a.render(v, 460, 380);
}

function blackCat(v: Variant) {
  const a = new Art();
  const d = wob([
    [60, 470], [64, 400], [90, 330], [130, 250], [190, 200], [260, 190], [320, 220], [356, 270], [372, 330],
    [380, 400], [384, 470], [356, 470], [350, 400], [330, 352], [300, 330], [250, 340], [190, 360], [150, 400],
    [140, 470], [112, 470], [108, 420], [94, 470],
  ], 3, 2);
  const head = wob([[70, 330], [40, 300], [30, 250], [36, 196], [56, 216], [84, 210], [110, 186], [118, 236], [110, 290], [96, 322]], 2, 3);
  const tail = wob([[372, 300], [420, 250], [440, 170], [420, 110], [432, 96], [462, 150], [458, 240], [404, 320]], 2, 4);
  for (const p of [d, head, tail]) a.raw(`<path d="${p}" fill="${C.violet}" transform="translate(8 6)"/>`, 'fills');
  a.solid(d); a.solid(head); a.solid(tail);
  a.raw(`<path d="M52 256 l18 -4 -6 14z M92 252 l-16 -2 6 14z" fill="${C.orange}"/><path d="M60 290 l8 8 8 -8" stroke="${C.cream}" stroke-width="3" fill="none"/>`, 'top');
  return a.render(v, 480, 490);
}

// ---------------------------------------------------------------- hands & arms
function skeletonHand(v: Variant) {
  const a = new Art();
  bone(a, 160, 610, 152, 420, 36, 1);
  bone(a, 216, 610, 214, 422, 32, 2);
  a.next();
  a.shape(wob(ell(184, 396, 66, 42, 12), 2, 3), C.bone, { sw: 7, shade: 0.45 });
  a.next();
  // [angle deg, length, curl]
  const fingers: [number, number, number][] = [[-58, 150, -0.22], [-22, 200, -0.06], [0, 220, 0.04], [20, 205, 0.1], [44, 165, 0.18]];
  const base: Pt[] = [[128, 410], [150, 362], [182, 354], [212, 360], [238, 376]];
  fingers.forEach(([ang, len, curl], i) => {
    let [x, y] = base[i];
    let cur = (ang * Math.PI) / 180;
    [0.42, 0.33, 0.25].forEach((s, j) => {
      const L = len * s;
      const nx = x + Math.sin(cur) * L, ny = y - Math.cos(cur) * L;
      bone(a, x, y, nx, ny, 24 - j * 4, 10 + i * 3 + j);
      x = nx; y = ny;
      cur += curl * (j + 1);
    });
  });
  return a.render(v, 360, 620);
}

function zombieArm(v: Variant) {
  const a = new Art();
  a.shape(wob([[110, 600], [128, 380], [168, 330], [240, 340], [262, 400], [270, 600]], 3, 1), C.cream, { sw: 9, shade: 0.55, shadeDx: -30 });
  a.shape(poly([[104, 600], [112, 470], [140, 488], [160, 456], [190, 486], [222, 452], [250, 484], [276, 470], [282, 600]], 1, 3), C.burgundy, { sw: 8, shade: 0.5 });
  // hand
  const hand: Pt[] = [
    [140, 350], [112, 300], [70, 250], [60, 228], [84, 230], [130, 270], [118, 180], [104, 104], [126, 98], [150, 180],
    [158, 74], [182, 72], [184, 180], [200, 84], [224, 90], [216, 192], [240, 120], [262, 128], [248, 230], [250, 330],
  ];
  a.shape(wob(hand, 2, 4), C.cream, { sw: 8, shade: 0.55, shadeDx: -22, shadeDy: -8 });
  a.stroke(line([[150, 240], [170, 262], [196, 250]], 1, 3), 4, C.violet);
  a.stroke(line([[160, 380], [180, 420], [176, 440]], 1, 4), 4, C.violet);
  a.raw(`<path d="${wob([[180, 300], [200, 296], [206, 316], [190, 324]], 1, 2)}" fill="${C.blood}"/>`, 'top');
  // dirt mound
  a.shape(wob([[0, 600], [20, 560], [80, 540], [150, 556], [230, 540], [320, 552], [380, 600]], 3, 9), C.ink, { sw: 6 });
  return a.render(v, 380, 600);
}

function claw(v: Variant) {
  const a = new Art();
  const d = wob([
    [170, 520], [150, 400], [100, 330], [40, 260], [26, 220], [60, 230], [120, 290], [104, 160], [96, 60], [124, 66],
    [150, 170], [166, 40], [194, 46], [194, 170], [226, 66], [254, 76], [228, 200], [276, 130], [300, 142], [258, 260],
    [262, 400], [250, 520],
  ], 2, 5);
  a.raw(`<path d="${d}" fill="${C.scarlet}" transform="translate(10 6)"/>`, 'fills');
  a.solid(d);
  const nails: [number, number, number, number][] = [[26, 220, 6, 190], [96, 60, 88, 14], [166, 40, 172, -4], [226, 66, 246, 26], [276, 130, 312, 100]];
  nails.forEach(([x, y, tx, ty], i) => a.shape(wob([[x - 8, y + 6], [tx, ty], [x + 12, y + 2]], 0.5, i), C.cream, { sw: 5 }));
  return a.render(v, 330, 530);
}

function shadowHand(v: Variant) {
  const a = new Art();
  const d = wob([
    [60, 600], [80, 460], [70, 380], [30, 300], [20, 250], [50, 256], [92, 330], [80, 190], [66, 70], [96, 66], [118, 190],
    [124, 30], [154, 30], [152, 190], [180, 54], [210, 62], [186, 210], [226, 120], [252, 130], [214, 280], [216, 400], [200, 600],
  ], 4, 8);
  a.solid(d, C.ink, 0.92);
  return a.render(v, 270, 600);
}

// ---------------------------------------------------------------- eyes & brows
function creepyEye(v: Variant) {
  const a = new Art();
  a.shape(wob([[20, 150], [80, 70], [180, 44], [280, 70], [340, 150], [280, 226], [180, 252], [80, 226]], 2, 3), C.paper, { sw: 9, shade: 0.4 });
  const veins = [[[40, 150], [80, 130], [110, 140], [130, 120]], [[50, 170], [90, 190], [120, 182]], [[320, 140], [280, 120], [250, 128]], [[310, 170], [270, 196], [240, 186], [230, 200]]] as Pt[][];
  veins.forEach((p, i) => a.raw(`<path d="${line(p, 2, i)}" fill="none" stroke="${C.scarlet}" stroke-width="3.5"/>`, 'fixed'));
  a.shape(circ(180, 148, 70, 2, 4), C.scarlet, { sw: 7, shade: 0.4 });
  a.shape(circ(180, 148, 34, 1.5, 5), C.ink, { sw: 4 });
  a.hiFill(circ(160, 126, 13, 0.8, 1));
  a.hiFill(circ(204, 168, 6, 0.5, 2));
  a.stroke(line([[30, 140], [80, 64], [180, 34], [282, 62], [340, 140]], 1.5, 9), 12);
  return a.render(v, 360, 270);
}

function spiralEyes(v: Variant) {
  const a = new Art();
  spiralEye(a, 100, 100, 80, 1, 1);
  spiralEye(a, 290, 100, 80, 2, -1);
  return a.render(v, 390, 200);
}

function brows(kind: 'angry' | 'worried') {
  return (v: Variant) => {
    const a = new Art();
    if (kind === 'angry') {
      a.shape(wob([[20, 40], [150, 100], [160, 130], [30, 80]], 2, 1), C.ink, { sw: 4 });
      a.shape(wob([[380, 40], [250, 100], [240, 130], [370, 80]], 2, 2), C.ink, { sw: 4 });
    } else {
      a.shape(wob([[20, 120], [90, 64], [160, 40], [170, 66], [100, 92], [34, 140]], 2, 3), C.ink, { sw: 4 });
      a.shape(wob([[380, 120], [310, 64], [240, 40], [230, 66], [300, 92], [366, 140]], 2, 4), C.ink, { sw: 4 });
    }
    return a.render(v, 400, 170);
  };
}

function eyesInDark(v: Variant) {
  const a = new Art();
  a.solid(wob([[10, 120], [40, 40], [200, 10], [370, 40], [400, 120], [370, 200], [200, 230], [40, 200]], 6, 3));
  for (const [cx, s] of [[130, 1], [270, -1]] as const) {
    a.raw(`<path d="${wob([[cx - 60, 120], [cx - 10 * s, 84 - 6], [cx + 60, 112 + s * 6], [cx + 5 * s, 140]], 1.5, cx)}" fill="${C.orange}"/>`, 'top');
    a.raw(`<path d="${wob([[cx - 40, 118], [cx, 102], [cx + 36, 116], [cx, 130]], 1, cx + 1)}" fill="${C.paper}"/>`, 'top');
    a.raw(`<ellipse cx="${cx}" cy="116" rx="6" ry="14" fill="${C.ink}"/>`, 'top');
  }
  return a.render(v, 410, 240);
}

// ---------------------------------------------------------------- partygoers
function skeletonDancer(v: Variant) {
  const a = new Art();
  // legs
  bone(a, 170, 400, 130, 500, 18, 1); bone(a, 130, 500, 120, 600, 16, 2);
  bone(a, 214, 400, 250, 490, 18, 3); bone(a, 250, 490, 300, 560, 16, 4);
  a.shape(wob(ell(118, 610, 26, 10, 8), 1, 1), C.bone, { sw: 5 });
  a.shape(wob(ell(312, 566, 26, 10, 8), 1, 2), C.bone, { sw: 5 });
  // pelvis & spine
  a.shape(wob([[150, 380], [192, 360], [234, 380], [224, 412], [192, 420], [160, 412]], 1.5, 5), C.bone, { sw: 6, shade: 0.4 });
  bone(a, 192, 368, 192, 220, 14, 6);
  // ribs
  for (let i = 0; i < 4; i++) {
    const y = 230 + i * 26, w = 62 - i * 6;
    a.stroke(line([[192, y], [192 - w, y + 8], [192 - w + 6, y + 22]], 1, i), 10, C.ink);
    a.stroke(line([[192, y], [192 + w, y + 8], [192 + w - 6, y + 22]], 1, i + 9), 10, C.ink);
    a.stroke(line([[192, y], [192 - w, y + 8], [192 - w + 6, y + 22]], 1, i), 5, C.bone);
    a.stroke(line([[192, y], [192 + w, y + 8], [192 + w - 6, y + 22]], 1, i + 9), 5, C.bone);
  }
  // arms: one up with cup, one on hip
  bone(a, 140, 226, 92, 160, 15, 7); bone(a, 92, 160, 70, 80, 14, 8);
  bone(a, 244, 226, 296, 290, 15, 9); bone(a, 296, 290, 250, 340, 14, 10);
  // cup
  a.shape(poly([[40, 30], [96, 30], [88, 92], [48, 92]], 1, 3), C.scarlet, { sw: 6, shade: 0.4 });
  a.shape(wob(ell(68, 30, 28, 7, 10), 0.5, 1), C.cream, { sw: 5 });
  skull(a, 196, 150, 56, 4);
  return a.render(v, 360, 630);
}

function ghoulPartier(v: Variant) {
  const a = new Art();
  const d = wob([
    [90, 600], [80, 450], [96, 330], [130, 280], [118, 240], [120, 180], [96, 120], [140, 150], [170, 128], [210, 128],
    [240, 150], [284, 120], [262, 180], [264, 240], [252, 280], [300, 300], [330, 240], [340, 160], [366, 160], [370, 250],
    [340, 340], [300, 380], [300, 450], [290, 600],
  ], 3, 6);
  a.raw(`<path d="${d}" fill="${C.violet}" transform="translate(9 6)"/>`, 'fills');
  a.solid(d);
  a.raw(`<path d="M160 196 l22 6 -22 8z M224 196 l-22 6 22 8z" fill="${C.orange}"/><path d="${line([[166, 236], [192, 246], [218, 236]], 1, 2)}" stroke="${C.orange}" stroke-width="4" fill="none"/>`, 'top');
  a.shape(poly([[326, 90], [382, 90], [374, 160], [334, 160]], 1, 4), C.navy, { sw: 6 });
  a.raw(`<rect x="332" y="104" width="44" height="34" fill="${C.coffee}" opacity=".85"/>`, 'fills');
  a.stroke('M370 92 L392 40', 6);
  return a.render(v, 410, 600);
}

function partyGhost(v: Variant) {
  const svg = ghost('boo', 41, -6)(v);
  // add hat + drink by layering a second art on top
  const a = new Art();
  a.shape(poly([[150, 74], [208, -6 + 10], [250, 58]], 1, 2), C.violet, { sw: 7 });
  a.raw(`<path d="M175 60 L222 30 M190 76 L242 44" stroke="${C.orange}" stroke-width="7"/>`, 'top');
  a.shape(circ(208, 8, 14, 1, 3), C.orange, { sw: 5 });
  const extra = a.render(v, 410, 400);
  return svg.replace('</svg>', extra.replace(/^<svg[^>]*>/, '<g>').replace('</svg>', '</g></svg>'));
}

// ---------------------------------------------------------------- portrait frames
function ovalFrame(v: Variant) {
  const a = new Art();
  const outer = wob(ell(200, 250, 190, 240, 30), 3, 1);
  const inner = wob(ell(200, 250, 140, 186, 26), 2, 2);
  a.raw(`<path d="${outer}${inner}" fill-rule="evenodd" fill="${C.cream}"/>`, 'fills');
  a.raw(`<path d="${outer}${inner}" fill-rule="evenodd" fill="url(#ht)" opacity=".35"/>`, 'fills');
  a.stroke(outer, 9); a.stroke(inner, 9);
  a.stroke(wob(ell(200, 250, 166, 214, 28), 2, 3), 4, C.blood);
  for (let i = 0; i < 12; i++) {
    const t = (i / 12) * Math.PI * 2;
    a.shape(circ(200 + Math.cos(t) * 166, 250 + Math.sin(t) * 214, 8, 0.5, i), C.scarlet, { sw: 4 });
  }
  a.shape(wob([[150, 18], [200, -2 + 10], [250, 18], [236, 40], [164, 40]], 1.5, 5), C.blood, { sw: 6 });
  return a.render(v, 400, 500);
}

function archFrame(v: Variant) {
  const a = new Art();
  const outerPts: Pt[] = [[20, 520], [20, 200], ...ell(200, 200, 180, 180, 14, Math.PI, Math.PI * 2).slice(1, -1), [380, 200], [380, 520]];
  const innerPts: Pt[] = [[70, 480], [70, 210], ...ell(200, 210, 130, 130, 12, Math.PI, Math.PI * 2).slice(1, -1), [330, 210], [330, 480]];
  const o = wob(outerPts, 2, 1), i = wob(innerPts, 2, 2);
  a.raw(`<path d="${o}${i}" fill-rule="evenodd" fill="${C.burgundy}"/><path d="${o}${i}" fill-rule="evenodd" fill="url(#htr)" opacity=".5"/>`, 'fills');
  a.stroke(o, 9); a.stroke(i, 9);
  a.shape(wob([[120, 480], [280, 480], [300, 540], [100, 540]], 1.5, 3), C.cream, { sw: 7 });
  return a.render(v, 400, 550);
}

function boltFrame(v: Variant) {
  const a = new Art();
  const o = wob([[14, 20], [386, 12], [394, 488], [8, 494]], 3, 1);
  const i = wob([[54, 60], [348, 54], [352, 444], [50, 450]], 2, 2);
  a.raw(`<path d="${o}${i}" fill-rule="evenodd" fill="${C.navy}"/><path d="${o}${i}" fill-rule="evenodd" fill="url(#hatch)" opacity=".25"/>`, 'fills');
  a.stroke(o, 10); a.stroke(i, 8);
  for (const [x, y] of [[34, 40], [366, 34], [370, 466], [30, 470]] as Pt[]) {
    a.shape(circ(x, y, 11, 0.6, x), C.cream, { sw: 5 });
    a.stroke(`M${x - 6} ${y - 6}L${x + 6} ${y + 6}`, 3);
  }
  return a.render(v, 400, 500);
}

export const CHARACTERS: SvgAsset[] = [
  A('ghost-boo', 'Ghost — Boo!', 'Ghosts', 'ghost cute boo cartoon', 410, 400, ghost('boo', 11), 340),
  A('ghost-scream', 'Ghost — Scream', 'Ghosts', 'ghost scream scared cartoon', 410, 400, ghost('scream', 12, 5), 340),
  A('ghost-spiral', 'Ghost — Spiral Eyes', 'Ghosts', 'ghost spiral hypnotized dizzy', 410, 400, ghost('spiral', 13, -4), 340),
  A('ghost-grin', 'Ghost — Evil Grin', 'Ghosts', 'ghost grin teeth evil', 410, 400, ghost('grin', 14), 340),
  A('ghost-sleepy', 'Ghost — Sleepy', 'Ghosts', 'ghost sleepy cute zzz', 410, 400, ghost('sleepy', 15, 3), 340),
  A('ghost-peek', 'Peeking Ghost', 'Ghosts', 'ghost peek edge cute', 300, 312, peekGhost, 300),
  A('party-ghost', 'Party Ghost', 'Partygoers', 'ghost party hat celebrate', 410, 400, partyGhost, 340),
  A('pumpkin-head', 'Pumpkin-Head Host', 'Pumpkin Heads', 'pumpkin character waving jack', 380, 600, pumpkinHead, 520),
  A('hooded-stalker', 'Hooded Stalker', 'Silhouettes', 'silhouette hood slasher knife horror', 360, 600, hoodedStalker, 560),
  A('vampire', 'Vampire Silhouette', 'Silhouettes', 'vampire dracula cape silhouette', 400, 570, vampire, 520),
  A('witch', 'Witch on Broom', 'Silhouettes', 'witch broom flying silhouette', 460, 380, witch, 420),
  A('black-cat', 'Arched Black Cat', 'Silhouettes', 'cat black arched spooky silhouette', 480, 490, blackCat, 420),
  A('skeleton-hand', 'Skeleton Hand', 'Hands & Arms', 'skeleton hand bones reaching', 360, 610, skeletonHand, 480),
  A('zombie-arm', 'Reaching Zombie Arm', 'Hands & Arms', 'zombie arm hand grave reaching', 380, 600, zombieArm, 480),
  A('monster-claw', 'Monster Claw', 'Hands & Arms', 'claw hand monster nails', 330, 530, claw, 440),
  A('shadow-hand', 'Shadow Hand', 'Hands & Arms', 'shadow hand silhouette creeping', 270, 600, shadowHand, 520),
  A('creepy-eye', 'Bloodshot Eye', 'Eyes & Brows', 'eye creepy veins bloodshot', 360, 270, creepyEye, 260),
  A('spiral-eyes', 'Spiral Eyes', 'Eyes & Brows', 'spiral eyes hypnotic dizzy', 390, 200, spiralEyes, 240),
  A('brows-angry', 'Angry Eyebrows', 'Eyes & Brows', 'eyebrows angry brows expression', 400, 170, brows('angry'), 240),
  A('brows-worried', 'Worried Eyebrows', 'Eyes & Brows', 'eyebrows worried brows expression', 400, 170, brows('worried'), 240),
  A('eyes-dark', 'Eyes in the Dark', 'Eyes & Brows', 'eyes darkness peeking glowing', 410, 240, eyesInDark, 300),
  A('skeleton-dancer', 'Dancing Skeleton', 'Partygoers', 'skeleton dance party drink', 360, 630, skeletonDancer, 520),
  A('ghoul-partier', 'Party Ghoul', 'Partygoers', 'ghoul party silhouette horns drink', 410, 600, ghoulPartier, 520),
  A('frame-oval', 'Oval Portrait Frame', 'Portrait Frames', 'frame portrait oval vintage', 400, 500, ovalFrame, 420),
  A('frame-arch', 'Tomb Arch Frame', 'Portrait Frames', 'frame portrait arch tomb', 400, 550, archFrame, 420),
  A('frame-bolt', 'Bolted Comic Frame', 'Portrait Frames', 'frame portrait comic bolts', 400, 500, boltFrame, 420),
];
