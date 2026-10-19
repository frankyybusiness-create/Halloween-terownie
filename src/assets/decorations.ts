import type { Variant } from '../model/types';
import { batPath, blobs, bone, cobwebLines, flamePts, jackFace, pumpkin, skull } from './draw';
import { Art, C, Pt, circ, ell, line, poly, rng, starPts, wob } from './style';
import type { SvgAsset } from './types';

const A = (
  id: string, name: string, group: string, tags: string, w: number, h: number,
  draw: (v: Variant) => string, insert?: number,
): SvgAsset => ({ kind: 'svg', id, name, cat: 'decorations', group, tags: tags.split(' '), w, h, draw, insert });

// ---------------------------------------------------------------- bats
const bat = (wing: 'up' | 'down' | 'glide') => (v: Variant) => {
  const a = new Art();
  const d = batPath(200, 150, 190, wing, wing.length);
  a.raw(`<path d="${d}" fill="${C.violet}" transform="translate(8 6)"/>`, 'fills');
  a.solid(d);
  a.raw(`<path d="M186 104 l8 5 -9 3z M214 104 l-8 5 9 3z" fill="${C.scarlet}"/>`, 'top');
  return a.render(v, 400, 300);
};

function batSwarm(v: Variant) {
  const a = new Art();
  const r = rng(5);
  const list: [number, number, number, 'up' | 'down' | 'glide'][] = [
    [120, 140, 90, 'up'], [300, 90, 60, 'down'], [430, 170, 75, 'glide'], [250, 230, 48, 'up'], [70, 270, 40, 'down'], [380, 300, 36, 'up'],
  ];
  for (const [x, y, s, w] of list) {
    const d = batPath(x, y, s, w, Math.floor(r() * 100));
    a.raw(`<path d="${d}" fill="${C.violet}" transform="translate(6 4)"/>`, 'fills');
    a.solid(d);
  }
  return a.render(v, 520, 360);
}

// ---------------------------------------------------------------- moons
function crescent(v: Variant) {
  const a = new Art();
  const outer = ell(200, 200, 170, 170, 20, Math.PI * 0.45, Math.PI * 1.55);
  const inner = ell(270, 190, 140, 150, 18, Math.PI * 1.38, Math.PI * 0.62 - 0.0001 + Math.PI * 0).reverse();
  const inner2 = ell(260, 195, 135, 145, 18, Math.PI * 0.62, Math.PI * 1.38);
  void inner;
  const d = wob([...outer, ...inner2.reverse()], 2, 3);
  a.shape(d, C.cream, { sw: 9, shade: 0.45, shadeDx: 20, shadeDy: -10 });
  a.shape(circ(110, 150, 14, 1, 2), 'none', { sw: 4 });
  a.shape(circ(90, 240, 9, 1, 3), 'none', { sw: 4 });
  a.hi(line([[70, 160], [80, 110], [110, 70]], 1, 1), 6);
  return a.render(v, 360, 400);
}

function fullMoon(v: Variant) {
  const a = new Art();
  a.shape(circ(200, 200, 175, 2.5, 4, 22), C.cream, { sw: 10, shade: 0.5, shadeDx: -40, shadeDy: -26 });
  const craters: [number, number, number][] = [[140, 130, 30], [250, 110, 18], [270, 230, 40], [150, 260, 22], [210, 180, 12], [110, 200, 12]];
  craters.forEach(([x, y, r], i) => a.shape(circ(x, y, r, 1.2, i + 5), C.bone, { sw: 5, shade: 0.6, shadeDx: -r * 0.4, shadeDy: -r * 0.4 }));
  a.hi(line([[60, 170], [80, 110], [120, 70]], 1, 2), 7);
  return a.render(v, 400, 400);
}

function moonClouds(v: Variant) {
  const a = new Art();
  a.shape(circ(260, 170, 140, 2, 6, 20), C.cream, { sw: 9, shade: 0.45, shadeDx: -30, shadeDy: -20 });
  a.shape(circ(220, 130, 24, 1, 2), C.bone, { sw: 5 });
  a.shape(circ(300, 210, 30, 1, 3), C.bone, { sw: 5 });
  a.next();
  blobs(a, [[70, 300, 40], [120, 270, 52], [180, 280, 44], [220, 304, 30], [40, 318, 24]], C.violet, 8, 3);
  a.next();
  blobs(a, [[300, 340, 34], [350, 318, 44], [400, 336, 32], [270, 356, 22], [430, 356, 22]], C.navy, 8, 7);
  return a.render(v, 480, 400);
}

// ---------------------------------------------------------------- haunted
function hauntedHouse(v: Variant) {
  const a = new Art();
  // ground
  a.shape(wob([[0, 560], [60, 530], [200, 520], [380, 528], [480, 548], [480, 600], [0, 600]], 2, 1), C.ink, { sw: 6 });
  // main body (crooked)
  a.shape(poly([[90, 540], [100, 270], [380, 250], [394, 540]], 2, 2), C.burgundy, { sw: 9, shade: 0.55, shadeDx: -40 });
  // tower
  a.shape(poly([[250, 270], [256, 130], [350, 124], [360, 262]], 2, 3), C.burgundy, { sw: 9, shade: 0.55, shadeDx: -30 });
  a.next();
  a.shape(poly([[234, 136], [300, 16], [378, 128]], 2, 4), C.ink, { sw: 8 });
  a.shape(poly([[60, 290], [170, 170], [270, 260], [254, 286], [168, 210], [80, 304]], 2, 5), C.ink, { sw: 8 });
  a.shape(poly([[300, 276], [404, 236], [430, 270]], 2, 6), C.ink, { sw: 8 });
  // windows glowing
  const win = (x: number, y: number, w: number, h: number, seed: number) => {
    a.shape(poly([[x, y], [x + w, y + 3], [x + w - 2, y + h], [x + 2, y + h - 2]], 1.5, seed), C.orange, { sw: 6 });
    a.stroke(`M${x + w / 2} ${y + 2}L${x + w / 2} ${y + h - 2}M${x + 2} ${y + h / 2}L${x + w - 2} ${y + h / 2}`, 4);
  };
  win(130, 330, 56, 70, 1); win(290, 320, 56, 70, 2); win(276, 160, 50, 56, 3); win(130, 430, 50, 60, 4);
  // door
  a.shape(wob([[210, 540], [208, 440], [236, 410], [264, 440], [266, 540]], 1, 7), C.ink, { sw: 6 });
  a.raw(`<circle cx="254" cy="490" r="5" fill="${C.orange}"/>`, 'top');
  // boards / cracks
  a.stroke(line([[110, 300], [140, 316], [126, 340]], 1, 3), 4);
  a.stroke(line([[360, 450], [340, 470], [356, 500]], 1, 4), 4);
  return a.render(v, 480, 600);
}

function crookedWindow(v: Variant) {
  const a = new Art();
  a.shape(poly([[30, 40], [330, 20], [350, 420], [20, 440]], 3, 1), C.burgundy, { sw: 10 });
  a.shape(poly([[60, 70], [300, 54], [318, 390], [50, 404]], 2, 2), C.orange, { sw: 8 });
  a.raw(`<path d="${poly([[60, 70], [300, 54], [318, 390], [50, 404]], 2, 2)}" fill="url(#htr)" opacity=".55"/>`, 'fills');
  a.stroke(line([[180, 60], [184, 398]], 1, 3), 12);
  a.stroke(line([[56, 230], [310, 220]], 1, 4), 12);
  // silhouette peeking
  a.solid(wob([[220, 400], [226, 300], [244, 260], [270, 252], [292, 270], [304, 310], [306, 400]], 2, 5));
  a.raw(`<circle cx="258" cy="292" r="6" fill="${C.paper}"/><circle cx="284" cy="292" r="6" fill="${C.paper}"/>`, 'top');
  a.stroke(poly([[30, 420], [10, 470], [360, 450], [350, 410]], 2, 6), 9);
  return a.render(v, 370, 480);
}

function deadTree(v: Variant) {
  const a = new Art();
  const d = wob([
    [150, 600], [170, 480], [160, 380], [100, 300], [40, 260], [50, 248], [110, 280], [120, 200], [90, 130], [104, 126],
    [140, 210], [170, 300], [190, 200], [230, 100], [244, 108], [210, 220], [212, 300], [270, 230], [340, 200], [344, 214],
    [270, 260], [222, 360], [230, 480], [260, 600],
  ], 2, 5);
  a.raw(`<path d="${d}" fill="${C.burgundy}" transform="translate(8 6)"/>`, 'fills');
  a.solid(d);
  return a.render(v, 380, 610);
}

// ---------------------------------------------------------------- pumpkins
const pumpkinAsset = (face: 'none' | 'classic' | 'scary' | 'goofy', seed: number) => (v: Variant) => {
  const a = new Art();
  pumpkin(a, 200, 220, 170, 140, seed);
  if (face !== 'none') {
    a.next();
    jackFace(a, 200, 230, 150, face, face === 'scary' ? C.scarlet : '#FFC24A', seed);
  }
  return a.render(v, 400, 380);
};

// ---------------------------------------------------------------- bones
function skullAsset(v: Variant) {
  const a = new Art();
  skull(a, 200, 200, 150, 8);
  return a.render(v, 400, 380);
}

function skullCrossbones(v: Variant) {
  const a = new Art();
  bone(a, 60, 300, 340, 400, 36, 1);
  bone(a, 340, 300, 60, 400, 36, 2);
  a.next();
  skull(a, 200, 190, 120, 3);
  return a.render(v, 400, 460);
}

function boneAsset(v: Variant) {
  const a = new Art();
  bone(a, 60, 150, 340, 100, 54, 3);
  return a.render(v, 400, 250);
}

function tombstone(v: Variant) {
  const a = new Art();
  a.shape(wob([[50, 520], [56, 200], ...ell(200, 200, 144, 150, 12, Math.PI, Math.PI * 2).slice(1, -1), [346, 200], [350, 520]], 2, 2), '#B9A98C', { sw: 10, shade: 0.5, shadeDx: -40 });
  a.stroke(line([[110, 170], [140, 210], [128, 250], [150, 280]], 1, 1), 4);
  a.stroke(line([[280, 380], [300, 420], [292, 460]], 1, 2), 4);
  a.shape(wob([[10, 560], [40, 510], [200, 500], [360, 510], [390, 560]], 2, 3), C.ink, { sw: 6 });
  return a.render(v, 400, 570);
}

function coffin(v: Variant) {
  const a = new Art();
  a.shape(poly([[150, 20], [250, 20], [330, 140], [280, 560], [120, 560], [70, 140]], 2, 3), C.burgundy, { sw: 10, shade: 0.55, shadeDx: -40 });
  a.shape(poly([[180, 200], [220, 200], [220, 240], [262, 240], [262, 280], [220, 280], [220, 390], [180, 390], [180, 280], [138, 280], [138, 240], [180, 240]], 1, 4), C.cream, { sw: 6 });
  a.hi(line([[100, 150], [146, 40]], 1, 1), 6, C.scarlet);
  return a.render(v, 400, 580);
}

// ---------------------------------------------------------------- webs & spiders
function cobweb(v: Variant) {
  const a = new Art();
  a.stroke(cobwebLines(0, 0, 380, 0, Math.PI / 2, 6, 6, 3), 4);
  a.stroke(cobwebLines(0, 0, 380, 0, Math.PI / 2, 6, 6, 3), 1.6, C.paper, 0.6);
  return a.render(v, 400, 400);
}

function spider(v: Variant) {
  const a = new Art();
  a.stroke('M150 0 L150 220', 3);
  for (const s of [-1, 1]) {
    [[-30, -50], [-10, -40], [10, 40], [30, 54]].forEach(([dy, ex], i) => {
      a.stroke(line([[150, 260 + dy * 0.3], [150 + s * 60, 240 + dy], [150 + s * (90 + i * 6), 280 + dy + ex * 0.4]], 1, i + s), 7);
    });
  }
  a.shape(circ(150, 280, 40, 1.5, 4), C.ink, { sw: 5 });
  a.shape(circ(150, 230, 24, 1, 5), C.ink, { sw: 5 });
  a.raw(`<path d="${wob([[136, 270], [164, 270], [150, 300]], 0.5, 1)}" fill="${C.scarlet}"/><circle cx="142" cy="226" r="5" fill="${C.paper}"/><circle cx="158" cy="226" r="5" fill="${C.paper}"/>`, 'top');
  return a.render(v, 300, 340);
}

// ---------------------------------------------------------------- candles & drips
function candle(a: Art, x: number, base: number, w: number, h: number, seed: number) {
  const top = base - h;
  const drips: Pt[] = [[x - w / 2, top + 10]];
  const r = rng(seed);
  for (let i = 0; i <= 4; i++) {
    const px = x - w / 2 + (w * i) / 4;
    drips.push([px, top + 10 + r() * h * 0.35 + (i % 2 ? h * 0.15 : 0)]);
  }
  a.shape(poly([[x - w / 2, top + 8], [x + w / 2, top + 8], [x + w / 2, base], [x - w / 2, base]], 1, seed), C.cream, { sw: 7, shade: 0.4, shadeDx: -w * 0.35, shadeDy: 0 });
  a.shape(wob([[x - w / 2 - 2, top + 4], ...drips.slice(1), [x + w / 2 + 2, top + 4], [x, top - 6]], 1, seed), C.scarlet, { sw: 6 });
  a.stroke(`M${x} ${top - 4}L${x} ${top - 20}`, 4);
  const fl = wob([[x, top - 70], [x + 16, top - 36], [x + 10, top - 18], [x - 10, top - 18], [x - 16, top - 36]], 1, seed);
  a.shape(fl, C.orange, { sw: 5 });
  a.raw(`<path d="${wob([[x, top - 52], [x + 7, top - 32], [x, top - 24], [x - 7, top - 32]], 0.5, seed)}" fill="#FFD86A"/>`, 'top');
}

function candleSingle(v: Variant) {
  const a = new Art();
  candle(a, 100, 420, 90, 300, 2);
  return a.render(v, 200, 440);
}

function candleTrio(v: Variant) {
  const a = new Art();
  candle(a, 90, 430, 70, 220, 3);
  candle(a, 300, 430, 72, 180, 4);
  a.next();
  candle(a, 195, 450, 86, 320, 5);
  a.shape(wob([[20, 450], [380, 444], [372, 470], [26, 474]], 1.5, 3), C.ink, { sw: 5 });
  return a.render(v, 400, 480);
}

function dripStrip(color: string, name: string) {
  return (v: Variant) => {
    const a = new Art();
    const r = rng(name.length);
    const pts: Pt[] = [[0, 0], [800, 0], [800, 40]];
    let x = 800;
    while (x > 0) {
      const w = 30 + r() * 50;
      const len = 30 + r() * 110;
      pts.push([x - w * 0.2, 44 + r() * 8], [x - w * 0.35, 44 + len], [x - w * 0.5, 44 + len + 12], [x - w * 0.65, 44 + len], [x - w * 0.8, 46 + r() * 8]);
      x -= w;
    }
    pts.push([0, 40]);
    a.shape(wob(pts, 1, 3), color, { sw: 7, shade: 0.35, shadeDx: 10, shadeDy: -8 });
    a.hi('M30 20 L200 18', 5);
    return a.render(v, 800, 220);
  };
}

// ---------------------------------------------------------------- claws, ghosts, shadows
function clawMarks(v: Variant) {
  const a = new Art();
  [0, 1, 2, 3].forEach((i) => {
    const x = 70 + i * 70;
    const d = wob([[x, 30 + i * 10], [x + 30, 120], [x + 44, 260], [x + 32, 380 - i * 14], [x + 20, 250], [x + 6, 120]], 1, i);
    a.raw(`<path d="${d}" fill="${C.scarlet}" transform="translate(6 4)"/>`, 'fills');
    a.solid(d);
  });
  return a.render(v, 400, 400);
}

function ghostSilhouette(v: Variant) {
  const a = new Art();
  const d = wob([[60, 360], [50, 200], [90, 80], [160, 40], [230, 80], [270, 200], [260, 360], [230, 320], [200, 370], [160, 320], [120, 370], [90, 320]], 3, 7);
  a.solid(d, C.paper, 0.85);
  a.solid(wob(ell(130, 160, 18, 28, 8), 1, 1));
  a.solid(wob(ell(190, 160, 18, 28, 8), 1, 2));
  a.solid(wob(ell(160, 240, 16, 26, 8), 1, 3));
  return a.render(v, 320, 400);
}

// ---------------------------------------------------------------- stars & symbols
function sparkle(v: Variant) {
  const a = new Art();
  a.shape(wob(starPts(150, 150, 140, 26, 4, -Math.PI / 2), 1, 2, true).replace(/C/g, 'C'), C.cream, { sw: 7, shade: 0.35 });
  return a.render(v, 300, 300);
}

function sparkleCluster(v: Variant) {
  const a = new Art();
  const s = (x: number, y: number, r: number, c: string, seed: number) =>
    a.shape(poly(starPts(x, y, r, r * 0.2, 4, -Math.PI / 2), 0.5, seed), c, { sw: 5 });
  s(140, 150, 110, C.cream, 1); s(300, 80, 60, C.scarlet, 2); s(290, 250, 44, C.orange, 3); s(60, 300, 34, C.cream, 4);
  return a.render(v, 380, 360);
}

function starOutline(v: Variant) {
  const a = new Art();
  a.stroke(poly(starPts(150, 160, 140, 58, 5), 1.5, 5), 12);
  return a.render(v, 300, 300);
}

function evilEye(v: Variant) {
  const a = new Art();
  a.shape(poly([[20, 280], [200, 10], [380, 280]], 1.5, 2), C.orange, { sw: 9, shade: 0.4 });
  a.shape(wob([[90, 190], [200, 130], [310, 190], [200, 250]], 1, 3), C.paper, { sw: 7 });
  a.shape(circ(200, 190, 40, 1, 4), C.scarlet, { sw: 6 });
  a.solid(circ(200, 190, 16, 0.5, 5));
  for (let i = 0; i < 9; i++) {
    const t = Math.PI * 1.05 + (i / 8) * Math.PI * 0.9;
    a.stroke(`M${200 + Math.cos(t) * 120} ${190 + Math.sin(t) * 90}L${200 + Math.cos(t) * 160} ${190 + Math.sin(t) * 130}`, 5);
  }
  return a.render(v, 400, 300);
}

function crystalBall(v: Variant) {
  const a = new Art();
  a.shape(poly([[90, 300], [310, 300], [340, 380], [60, 380]], 1.5, 1), C.burgundy, { sw: 8, shade: 0.5 });
  a.next();
  a.shape(circ(200, 170, 140, 2, 3, 20), C.violet, { sw: 9, shade: 0.5, shadeDx: -30, shadeDy: -30 });
  a.raw(`<path d="${wob(ell(210, 180, 80, 50, 12), 2, 4)}" fill="${C.navy}" opacity=".7"/>`, 'fills');
  a.raw(`<path d="${poly(starPts(180, 160, 40, 8, 4), 0, 1)}" fill="${C.cream}"/>`, 'top');
  a.hi(line([[110, 120], [140, 70], [190, 50]], 1, 2), 10);
  return a.render(v, 400, 400);
}

function planchette(v: Variant) {
  const a = new Art();
  a.shape(wob([[200, 20], [320, 140], [350, 300], [300, 380], [100, 380], [50, 300], [80, 140]], 2, 4), C.cream, { sw: 9, shade: 0.45, shadeDx: -30 });
  a.shape(circ(200, 200, 56, 1, 2), C.ink, { sw: 6 });
  a.raw(`<circle cx="200" cy="200" r="36" fill="${C.burgundy}"/><circle cx="186" cy="186" r="9" fill="${C.paper}" opacity=".7"/>`, 'top');
  a.stroke(line([[110, 330], [200, 350], [290, 330]], 1, 3), 4);
  return a.render(v, 400, 400);
}

function moonStar(v: Variant) {
  const a = new Art();
  const outer = ell(150, 150, 120, 120, 18, Math.PI * 0.4, Math.PI * 1.6);
  const inner = ell(200, 140, 96, 104, 16, Math.PI * 0.62, Math.PI * 1.38).reverse();
  a.shape(wob([...outer, ...inner], 1, 3), C.cream, { sw: 8 });
  a.shape(poly(starPts(240, 150, 46, 18, 5), 1, 4), C.orange, { sw: 6 });
  return a.render(v, 300, 300);
}

// ---------------------------------------------------------------- fire & smoke
function flame(v: Variant) {
  const a = new Art();
  a.shape(wob(flamePts(200, 470, 300, 440, 4), 2, 4), C.scarlet, { sw: 9, shade: 0.4, shadeDx: 20, shadeDy: -10 });
  a.next();
  a.shape(wob(flamePts(200, 460, 200, 300, 9), 1.5, 9), C.orange, { sw: 6 });
  a.next();
  a.shape(wob(flamePts(200, 452, 100, 160, 3), 1, 3), '#FFD86A', { sw: 5 });
  return a.render(v, 400, 480);
}

function smokePuff(v: Variant) {
  const a = new Art();
  blobs(a, [[120, 260, 80], [220, 220, 100], [320, 260, 74], [180, 140, 70], [270, 120, 56], [230, 60, 40]], '#CFC2B0', 9, 4, 0.4);
  return a.render(v, 420, 360);
}

function fogStrip(v: Variant) {
  const a = new Art();
  const r = rng(3);
  for (let row = 0; row < 3; row++) {
    const pts: Pt[] = [];
    const y = 120 + row * 36;
    for (let x = -20; x <= 920; x += 60) pts.push([x, y - 20 - r() * 40]);
    pts.push([920, 260], [-20, 260]);
    a.raw(`<path d="${wob(pts, 4, row + 1)}" fill="${C.cream}" opacity="${0.22 + row * 0.12}"/>`, 'inks');
  }
  return a.render(v, 900, 260);
}

function eerieCloud(v: Variant) {
  const a = new Art();
  a.solid(poly([[240, 230], [206, 320], [240, 314], [218, 392], [292, 284], [256, 290], [278, 230]], 1, 2));
  a.raw(`<path d="${poly([[244, 236], [214, 312], [246, 306], [230, 370], [280, 290], [248, 296], [270, 236]], 0.5, 2)}" fill="#FFD86A"/>`, 'inks');
  a.next();
  blobs(a, [[90, 200, 56], [160, 150, 76], [260, 120, 88], [360, 150, 72], [430, 200, 52], [260, 210, 60], [170, 214, 50], [350, 214, 50]], C.navy, 9, 4, 0.5);
  a.raw(`<path d="${line([[120, 150], [160, 120], [210, 116]], 1, 1)}" stroke="${C.violet}" stroke-width="10" stroke-linecap="round" fill="none"/>`, 'top');
  return a.render(v, 520, 400);
}

// ---------------------------------------------------------------- warnings
function hazard(v: Variant) {
  const a = new Art();
  a.shape(poly([[200, 20], [385, 350], [15, 350]], 2, 1), '#FFC24A', { sw: 14, shade: 0.35 });
  a.next();
  skull(a, 200, 230, 70, 2, C.paper);
  return a.render(v, 400, 370);
}

function poisonBottle(v: Variant) {
  const a = new Art();
  a.shape(wob([[160, 30], [240, 30], [236, 80], [224, 90], [226, 140], [300, 200], [310, 400], [90, 400], [100, 200], [176, 140], [176, 90], [164, 80]], 1.5, 4), C.violet, { sw: 9, shade: 0.5, shadeDx: -36 });
  a.shape(poly([[150, 18], [250, 18], [246, 50], [154, 50]], 1, 2), C.burgundy, { sw: 7 });
  a.shape(poly([[120, 240], [280, 236], [282, 350], [118, 352]], 1.5, 3), C.cream, { sw: 7 });
  a.next();
  skull(a, 200, 290, 38, 5, C.cream);
  a.hi(line([[120, 220], [126, 330]], 1, 1), 8, '#B9A2E0');
  return a.render(v, 400, 420);
}

export const DECORATIONS: SvgAsset[] = [
  A('bat-up', 'Bat — Wings Up', 'Bats', 'bat flying wings', 400, 300, bat('up'), 220),
  A('bat-down', 'Bat — Wings Down', 'Bats', 'bat flying wings', 400, 300, bat('down'), 220),
  A('bat-glide', 'Bat — Glide', 'Bats', 'bat flying glide', 400, 300, bat('glide'), 220),
  A('bat-swarm', 'Bat Swarm', 'Bats', 'bats swarm flock flying', 520, 360, batSwarm, 420),
  A('moon-crescent', 'Crescent Moon', 'Moons', 'moon crescent night', 360, 400, crescent, 300),
  A('moon-full', 'Full Moon', 'Moons', 'moon full craters night', 400, 400, fullMoon, 340),
  A('moon-clouds', 'Moon & Clouds', 'Moons', 'moon clouds night', 480, 400, moonClouds, 380),
  A('haunted-house', 'Haunted House', 'Haunted', 'haunted house mansion spooky', 480, 600, hauntedHouse, 460),
  A('crooked-window', 'Crooked Window', 'Haunted', 'window crooked glow silhouette haunted', 370, 480, crookedWindow, 320),
  A('dead-tree', 'Dead Tree', 'Haunted', 'tree dead branches spooky', 380, 610, deadTree, 460),
  A('tombstone', 'Blank Tombstone', 'Haunted', 'tombstone grave rip cemetery', 400, 570, tombstone, 320),
  A('coffin', 'Coffin', 'Haunted', 'coffin vampire cross', 400, 580, coffin, 320),
  A('pumpkin', 'Pumpkin', 'Pumpkins', 'pumpkin plain orange', 400, 380, pumpkinAsset('none', 2), 260),
  A('jack-classic', 'Jack-o’-Lantern', 'Pumpkins', 'pumpkin jack lantern carved classic', 400, 380, pumpkinAsset('classic', 3), 280),
  A('jack-scary', 'Scary Jack', 'Pumpkins', 'pumpkin jack lantern scary evil', 400, 380, pumpkinAsset('scary', 4), 280),
  A('jack-goofy', 'Goofy Jack', 'Pumpkins', 'pumpkin jack lantern goofy cute', 400, 380, pumpkinAsset('goofy', 5), 280),
  A('skull', 'Skull', 'Skulls & Bones', 'skull bone skeleton', 400, 380, skullAsset, 260),
  A('skull-crossbones', 'Skull & Crossbones', 'Skulls & Bones', 'skull crossbones pirate danger', 400, 460, skullCrossbones, 300),
  A('bone', 'Bone', 'Skulls & Bones', 'bone single', 400, 250, boneAsset, 240),
  A('cobweb', 'Cobweb Corner', 'Webs & Spiders', 'cobweb web corner spider', 400, 400, cobweb, 360),
  A('spider', 'Hanging Spider', 'Webs & Spiders', 'spider hanging thread', 300, 340, spider, 200),
  A('candle', 'Dripping Candle', 'Candles & Drips', 'candle wax drip flame', 200, 440, candleSingle, 280),
  A('candle-trio', 'Candle Trio', 'Candles & Drips', 'candles wax drip flame', 400, 480, candleTrio, 320),
  A('drip-blood', 'Blood Drip Strip', 'Candles & Drips', 'drip blood strip border top', 800, 220, dripStrip(C.blood, 'blood'), 1080),
  A('drip-wax', 'Cream Wax Drip', 'Candles & Drips', 'drip wax cream strip border', 800, 220, dripStrip(C.cream, 'waxx'), 1080),
  A('claw-marks', 'Claw Marks', 'Ghosts & Shadows', 'claw scratch marks slash', 400, 400, clawMarks, 300),
  A('ghost-silhouette', 'Faded Ghost', 'Ghosts & Shadows', 'ghost faded silhouette spirit', 320, 400, ghostSilhouette, 260),
  A('sparkle', 'Sparkle', 'Stars & Symbols', 'sparkle star twinkle', 300, 300, sparkle, 140),
  A('sparkle-cluster', 'Sparkle Cluster', 'Stars & Symbols', 'sparkle stars cluster twinkle', 380, 360, sparkleCluster, 220),
  A('star-outline', 'Outlined Star', 'Stars & Symbols', 'star outline', 300, 300, starOutline, 140),
  A('evil-eye', 'All-Seeing Eye', 'Stars & Symbols', 'eye occult symbol pyramid', 400, 300, evilEye, 260),
  A('crystal-ball', 'Crystal Ball', 'Stars & Symbols', 'crystal ball fortune psychic', 400, 400, crystalBall, 260),
  A('planchette', 'Planchette', 'Stars & Symbols', 'planchette ouija spirit', 400, 400, planchette, 220),
  A('moon-star', 'Moon & Star Symbol', 'Stars & Symbols', 'moon star symbol', 300, 300, moonStar, 180),
  A('flame', 'Flame', 'Fire & Smoke', 'flame fire burn', 400, 480, flame, 300),
  A('smoke', 'Smoke Puff', 'Fire & Smoke', 'smoke puff cloud', 420, 360, smokePuff, 320),
  A('fog', 'Fog Strip', 'Fire & Smoke', 'fog mist ground', 900, 260, fogStrip, 1080),
  A('eerie-cloud', 'Storm Cloud', 'Fire & Smoke', 'cloud storm lightning eerie', 520, 400, eerieCloud, 400),
  A('hazard', 'Skull Hazard Sign', 'Warnings', 'warning hazard danger skull sign', 400, 370, hazard, 260),
  A('poison', 'Poison Bottle', 'Warnings', 'poison bottle potion skull', 400, 420, poisonBottle, 260),
];
