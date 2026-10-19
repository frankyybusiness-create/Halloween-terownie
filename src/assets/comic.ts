import { makeImage, makeText } from '../model/factory';
import type { El, Variant } from '../model/types';
import { speckles, splatPts } from './draw';
import { Art, C, Pt, circ, ell, line, poly, rng, starPts, wob } from './style';
import type { CompositeAsset, SvgAsset } from './types';

const A = (
  id: string, name: string, group: string, tags: string, w: number, h: number,
  draw: (v: Variant) => string, insert?: number,
): SvgAsset => ({ kind: 'svg', id, name, cat: 'comic', group, tags: tags.split(' '), w, h, draw, insert });

// ---------------------------------------------------------------- panels
function panelFrame(v: Variant) {
  const a = new Art();
  const o = poly([[10, 10], [590, 14], [586, 790], [14, 786]], 3, 1);
  const i = poly([[40, 40], [560, 42], [558, 760], [42, 758]], 2, 2);
  a.raw(`<path d="${o}${i}" fill-rule="evenodd" fill="${C.ink}"/>`, 'inks');
  return a.render(v, 600, 800);
}

function panelIrregular(v: Variant) {
  const a = new Art();
  const o = poly([[30, 10], [590, 50], [560, 790], [10, 740]], 3, 3);
  const i = poly([[60, 44], [556, 80], [530, 756], [42, 712]], 2, 4);
  a.raw(`<path d="${o}${i}" fill-rule="evenodd" fill="${C.ink}"/>`, 'inks');
  return a.render(v, 600, 800);
}

function panelGrid3(v: Variant) {
  const a = new Art();
  const panels: Pt[][] = [
    [[20, 20], [580, 20], [580, 300], [20, 260]],
    [[20, 290], [300, 320], [290, 780], [20, 780]],
    [[330, 324], [580, 330], [580, 780], [320, 780]],
  ];
  panels.forEach((p, i) => a.stroke(poly(p, 2, i + 1), 22));
  return a.render(v, 600, 800);
}

function panelGrid4(v: Variant) {
  const a = new Art();
  const panels: Pt[][] = [
    [[20, 20], [340, 20], [320, 380], [20, 400]],
    [[370, 20], [580, 20], [580, 370], [350, 380]],
    [[20, 430], [318, 410], [330, 780], [20, 780]],
    [[350, 410], [580, 400], [580, 780], [360, 780]],
  ];
  panels.forEach((p, i) => a.stroke(poly(p, 2, i + 5), 22));
  return a.render(v, 600, 800);
}

// ---------------------------------------------------------------- bubbles
function speechRound(v: Variant) {
  const a = new Art();
  const body = ell(250, 155, 225, 130, 24, Math.PI * 0.74, Math.PI * 2.62);
  a.shape(wob([...body, [96, 336]], 2, 3), C.paper, { sw: 10, shade: 0.25, shadeDx: -30, shadeDy: -20 });
  return a.render(v, 500, 350);
}

function speechShout(v: Variant) {
  const a = new Art();
  const pts = starPts(250, 170, 225, 165, 16, 0, 0.18, 4).map(([x, y]) => [x, 175 + (y - 170) * 0.72] as Pt);
  pts.splice(11, 1, [110, 352]);
  a.shape(poly(pts, 2, 3), C.paper, { sw: 10, shade: 0.25 });
  return a.render(v, 500, 360);
}

function thought(v: Variant) {
  const a = new Art();
  const pts: Pt[] = [];
  const n = 11;
  for (let i = 0; i < n; i++) {
    const t0 = (i / n) * Math.PI * 2, t1 = ((i + 1) / n) * Math.PI * 2;
    const mid = (t0 + t1) / 2;
    pts.push([250 + Math.cos(t0) * 210, 150 + Math.sin(t0) * 115]);
    pts.push([250 + Math.cos(mid) * 250, 150 + Math.sin(mid) * 145]);
  }
  a.shape(wob(pts, 3, 2), C.paper, { sw: 10, shade: 0.25 });
  a.shape(circ(150, 320, 26, 1, 3), C.paper, { sw: 8 });
  a.shape(circ(110, 360, 14, 1, 4), C.paper, { sw: 7 });
  return a.render(v, 500, 390);
}

// ---------------------------------------------------------------- bursts
const burst = (n: number, ri: number, fill: string, inner: string | null, seed: number) => (v: Variant) => {
  const a = new Art();
  a.shape(poly(starPts(250, 250, 240, ri, n, -Math.PI / 2, 0.22, seed), 1, seed), fill, { sw: 11, shade: 0.35 });
  if (inner) {
    a.next();
    a.shape(poly(starPts(250, 250, 170, ri * 0.72, n, -Math.PI / 2 + 0.1, 0.25, seed + 1), 1, seed + 1), inner, { sw: 7 });
  }
  return a.render(v, 500, 500);
};

function explosion(v: Variant) {
  const a = new Art();
  const r = rng(9);
  const outer: Pt[] = [];
  for (let i = 0; i < 26; i++) {
    const t = (i / 26) * Math.PI * 2;
    const rad = i % 2 ? 150 + r() * 30 : 210 + r() * 40;
    outer.push([260 + Math.cos(t) * rad * 1.1, 240 + Math.sin(t) * rad * 0.9]);
  }
  a.shape(poly(outer, 2, 1), C.scarlet, { sw: 11, shade: 0.4 });
  a.next();
  const mid = outer.map(([x, y]) => [260 + (x - 260) * 0.68, 240 + (y - 240) * 0.68] as Pt);
  a.shape(poly(mid, 2, 2), C.orange, { sw: 8 });
  a.next();
  const inner = outer.map(([x, y]) => [260 + (x - 260) * 0.4, 240 + (y - 240) * 0.4] as Pt);
  a.shape(poly(inner, 2, 3), '#FFD86A', { sw: 6 });
  speckles(a, 20, 20, 480, 440, 26, 7, C.ink, 4);
  return a.render(v, 520, 480);
}

// ---------------------------------------------------------------- paper & labels
function tornStrip(fill: string, seed: number) {
  return (v: Variant) => {
    const a = new Art();
    const r = rng(seed);
    const top: Pt[] = [], bot: Pt[] = [];
    for (let x = 0; x <= 900; x += 18) {
      top.push([x, 20 + r() * 18]);
      bot.push([x, 140 + r() * 18]);
    }
    const d = poly([...top, ...bot.reverse()], 0, 1);
    a.raw(`<path d="${d}" fill="${C.ink}" transform="translate(6 7)" opacity=".85"/>`, 'fills');
    a.raw(`<path d="${d}" fill="${fill}"/>`, 'fixed');
    a.raw(`<path d="${d}" fill="url(#ht)" opacity=".12"/>`, 'fixed');
    return a.render(v, 910, 170);
  };
}

function distressedLabel(v: Variant) {
  const a = new Art();
  a.raw(`<path d="${poly([[24, 24], [580, 14], [588, 190], [16, 200]], 3, 1)}" fill="${C.ink}" transform="translate(10 10)"/>`, 'fills');
  a.shape(poly([[24, 24], [580, 14], [588, 190], [16, 200]], 3, 1), C.cream, { sw: 9 });
  a.stroke(poly([[44, 42], [560, 34], [566, 172], [36, 180]], 2, 2), 4);
  return a.render(v, 610, 220);
}

function priceTag(v: Variant) {
  const a = new Art();
  a.stroke(line([[90, 70], [40, 20], [10, 30]], 1, 1), 4);
  a.shape(poly([[60, 80], [130, 20], [440, 30], [440, 230], [130, 240], [60, 180]], 2, 2), C.cream, { sw: 10, shade: 0.35 });
  a.shape(circ(110, 130, 16, 0.5, 2), C.burgundy, { sw: 6 });
  a.stroke(poly([[150, 50], [420, 56], [420, 206], [150, 214]], 1.5, 3), 3, C.ink, 0.6);
  return a.render(v, 460, 260);
}

function badgeScallop(fill: string) {
  return (v: Variant) => {
    const a = new Art();
    const pts: Pt[] = [];
    for (let i = 0; i < 48; i++) {
      const t = (i / 48) * Math.PI * 2;
      const rad = i % 2 ? 200 : 186;
      pts.push([210 + Math.cos(t) * rad, 210 + Math.sin(t) * rad]);
    }
    a.shape(wob(pts, 0.5, 1), fill, { sw: 9, shade: 0.35 });
    a.stroke(circ(210, 210, 150, 1.5, 2, 22), 5);
    a.stroke(circ(210, 210, 140, 1.5, 3, 22), 2);
    return a.render(v, 420, 420);
  };
}

function badgeRing(v: Variant) {
  const a = new Art();
  a.shape(circ(210, 210, 196, 2, 1, 26), C.ink, { sw: 6 });
  a.shape(circ(210, 210, 176, 2, 2, 26), C.blood, { sw: 6 });
  a.shape(circ(210, 210, 120, 2, 3, 22), C.cream, { sw: 8 });
  for (let i = 0; i < 16; i++) {
    const t = (i / 16) * Math.PI * 2;
    a.raw(`<path d="${poly(starPts(210 + Math.cos(t) * 150, 210 + Math.sin(t) * 150, 9, 4, 5), 0, i)}" fill="${C.cream}"/>`, 'top');
  }
  return a.render(v, 420, 420);
}

// ---------------------------------------------------------------- arrows
function arrowCurved(v: Variant) {
  const a = new Art();
  a.stroke(line([[40, 300], [80, 160], [200, 70], [340, 80]], 2, 1), 14);
  a.shape(poly([[320, 40], [400, 86], [324, 124]], 1, 2), C.ink, { sw: 6 });
  return a.render(v, 420, 340);
}

function arrowSquiggle(v: Variant) {
  const a = new Art();
  a.stroke(line([[20, 200], [80, 120], [120, 220], [180, 120], [230, 220], [290, 130], [360, 150]], 2, 3), 11);
  a.shape(poly([[340, 100], [410, 160], [330, 196]], 1, 4), C.ink, { sw: 5 });
  return a.render(v, 420, 280);
}

function arrowStraight(v: Variant) {
  const a = new Art();
  a.shape(poly([[20, 110], [300, 96], [292, 40], [420, 128], [300, 210], [300, 156], [24, 160]], 2, 5), C.scarlet, { sw: 9, shade: 0.4 });
  return a.render(v, 440, 240);
}

// ---------------------------------------------------------------- halftone & ink
function htBlob(v: Variant) {
  const a = new Art();
  const d = wob(ell(260, 200, 240, 170, 16), 18, 4);
  a.raw(`<path d="${d}" fill="url(#htl)"/>`, 'inks');
  return a.render(v, 520, 400);
}

function htGradient(v: Variant) {
  const a = new Art();
  let d = '';
  for (let row = 0; row < 18; row++) {
    for (let col = 0; col < 30; col++) {
      const x = col * 20 + (row % 2) * 10 + 10, y = row * 20 + 10;
      const r = 9 * (1 - row / 18) ** 1.2;
      if (r > 0.6) d += `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
    }
  }
  a.solid(d);
  return a.render(v, 610, 370);
}

function htCircle(v: Variant) {
  const a = new Art();
  let d = '';
  for (let y = 10; y < 400; y += 16) for (let x = 10; x < 400; x += 16) {
    const dist = Math.hypot(x - 200, y - 200) / 200;
    const r = 7 * (1 - dist);
    if (r > 0.5) d += `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
  }
  a.solid(d, C.scarlet);
  return a.render(v, 400, 400);
}

const splatter = (seed: number, color: string) => (v: Variant) => {
  const a = new Art();
  a.solid(wob(splatPts(200, 200, 130, 13, seed), 3, seed), color);
  const r = rng(seed + 3);
  for (let i = 0; i < 14; i++) {
    const t = r() * Math.PI * 2, dist = 170 + r() * 40, rad = 4 + r() * 14;
    a.solid(circ(200 + Math.cos(t) * dist, 200 + Math.sin(t) * dist, rad, 1, i), color);
  }
  speckles(a, 0, 0, 400, 400, 30, 3, color, seed);
  return a.render(v, 400, 400);
};

function misregBlob(v: Variant) {
  const a = new Art();
  const d = wob(splatPts(200, 200, 150, 9, 2), 6, 2);
  a.raw(`<path d="${d}" fill="${C.navy}" transform="translate(-12 10)" opacity=".85"/><path d="${d}" fill="${C.scarlet}" transform="translate(12 -8)" style="mix-blend-mode:multiply"/>`, 'inks');
  a.raw(`<path d="${d}" fill="url(#ht)" opacity=".3"/>`, 'inks');
  return a.render(v, 420, 420);
}

function brushStroke(v: Variant) {
  const a = new Art();
  const r = rng(4);
  const top: Pt[] = [], bot: Pt[] = [];
  for (let x = 20; x <= 880; x += 30) {
    top.push([x, 40 + r() * 14 + Math.sin(x / 120) * 8]);
    bot.push([x, 150 - r() * 14 + Math.sin(x / 120) * 8]);
  }
  a.solid(wob([...top, [900, 90], ...bot.reverse(), [0, 100]], 2, 4), C.blood);
  for (let k = 0; k < 6; k++) a.stroke(line([[40 + r() * 60, 70 + k * 12], [840 - r() * 80, 72 + k * 12]], 2, k), 2, C.burgundy, 0.6);
  return a.render(v, 910, 190);
}

// ---------------------------------------------------------------- borders & ornaments
function border(v: Variant) {
  const a = new Art();
  const o = poly([[10, 10], [1070, 10], [1070, 1340], [10, 1340]], 2, 1);
  const i = poly([[40, 40], [1040, 40], [1040, 1310], [40, 1310]], 2, 2);
  a.raw(`<path d="${o}${i}" fill-rule="evenodd" fill="${C.ink}"/>`, 'inks');
  a.stroke(poly([[56, 56], [1024, 56], [1024, 1294], [56, 1294]], 1.5, 3), 4, C.cream);
  for (const [x, y, rot] of [[56, 56, 0], [1024, 56, 90], [1024, 1294, 180], [56, 1294, 270]] as [number, number, number][]) {
    a.raw(`<g transform="translate(${x} ${y}) rotate(${rot})"><path d="${poly(starPts(0, 0, 34, 10, 4), 0, 1)}" fill="${C.cream}" stroke="${C.ink}" stroke-width="5"/></g>`, 'top');
  }
  return a.render(v, 1080, 1350);
}

function corner(v: Variant) {
  const a = new Art();
  a.stroke(line([[20, 300], [20, 60], [60, 20], [300, 20]], 1, 1), 12);
  a.stroke(line([[50, 260], [50, 80], [80, 50], [260, 50]], 1, 2), 5);
  a.stroke(line([[90, 90], [140, 120], [130, 170], [90, 160], [100, 130]], 1, 3), 6);
  a.shape(poly(starPts(60, 60, 30, 10, 4), 0.5, 4), C.scarlet, { sw: 5 });
  a.shape(circ(300, 20, 10, 0.5, 5), C.cream, { sw: 5 });
  a.shape(circ(20, 300, 10, 0.5, 6), C.cream, { sw: 5 });
  return a.render(v, 320, 320);
}

function numberDisc(fill: string) {
  return (v: Variant) => {
    const a = new Art();
    a.shape(circ(100, 100, 86, 1.5, 3, 18), fill, { sw: 9, shade: 0.3 });
    return a.render(v, 200, 200);
  };
}

export const COMIC_SVG: SvgAsset[] = [
  A('panel-frame', 'Thick Panel Frame', 'Panels', 'panel frame comic border', 600, 800, panelFrame, 560),
  A('panel-irregular', 'Tilted Panel Frame', 'Panels', 'panel frame irregular comic tilted', 600, 800, panelIrregular, 560),
  A('panel-grid-3', '3-Panel Layout', 'Panels', 'panel grid comic layout three', 600, 800, panelGrid3, 900),
  A('panel-grid-4', '4-Panel Layout', 'Panels', 'panel grid comic layout four', 600, 800, panelGrid4, 900),
  A('speech-round', 'Speech Bubble', 'Bubbles', 'speech bubble talk comic', 500, 350, speechRound, 420),
  A('speech-shout', 'Shout Bubble', 'Bubbles', 'speech shout scream bubble jagged', 500, 360, speechShout, 420),
  A('thought', 'Thought Bubble', 'Bubbles', 'thought bubble cloud think', 500, 390, thought, 420),
  A('burst-12', 'Action Burst', 'Bursts', 'burst action star comic pow', 500, 500, burst(12, 150, C.scarlet, '#FFD86A', 3), 380),
  A('burst-24', 'Spiky Burst', 'Bursts', 'burst spiky star comic', 500, 500, burst(22, 175, '#FFD86A', null, 5), 380),
  A('burst-cream', 'Cream Starburst', 'Bursts', 'burst cream starburst', 500, 500, burst(16, 165, C.cream, null, 8), 380),
  A('burst-navy', 'Navy Double Burst', 'Bursts', 'burst navy violet double', 500, 500, burst(14, 150, C.navy, C.violet, 11), 380),
  A('explosion', 'Explosion', 'Bursts', 'explosion boom blast comic', 520, 480, explosion, 420),
  A('torn-cream', 'Torn Strip — Cream', 'Paper & Labels', 'torn paper strip cream tape', 910, 170, tornStrip(C.cream, 3), 900),
  A('torn-red', 'Torn Strip — Red', 'Paper & Labels', 'torn paper strip red', 910, 170, tornStrip(C.scarlet, 5), 900),
  A('torn-black', 'Torn Strip — Black', 'Paper & Labels', 'torn paper strip black', 910, 170, tornStrip(C.ink, 7), 900),
  A('label-distressed', 'Distressed Label', 'Paper & Labels', 'label frame distressed box', 610, 220, distressedLabel, 520),
  A('price-tag', 'Vintage Hang Tag', 'Paper & Labels', 'tag price hang label vintage', 460, 260, priceTag, 380),
  A('badge-scallop', 'Scalloped Seal', 'Badges', 'badge seal scallop circle', 420, 420, badgeScallop(C.scarlet), 300),
  A('badge-scallop-cream', 'Cream Seal', 'Badges', 'badge seal scallop cream', 420, 420, badgeScallop(C.cream), 300),
  A('badge-ring', 'Starred Ring Badge', 'Badges', 'badge ring circle stars horror', 420, 420, badgeRing, 300),
  A('number-disc', 'Number Disc', 'Badges', 'number disc circle panel', 200, 200, numberDisc('#FFD86A'), 120),
  A('arrow-curved', 'Curved Arrow', 'Arrows', 'arrow curved hand drawn', 420, 340, arrowCurved, 220),
  A('arrow-squiggle', 'Squiggle Arrow', 'Arrows', 'arrow squiggle hand drawn', 420, 280, arrowSquiggle, 220),
  A('arrow-straight', 'Block Arrow', 'Arrows', 'arrow block bold', 440, 240, arrowStraight, 220),
  A('ht-blob', 'Halftone Shadow', 'Halftone & Ink', 'halftone shadow dots blob', 520, 400, htBlob, 480),
  A('ht-gradient', 'Halftone Fade', 'Halftone & Ink', 'halftone gradient dots fade', 610, 370, htGradient, 600),
  A('ht-circle', 'Red Halftone Glow', 'Halftone & Ink', 'halftone circle radial dots red', 400, 400, htCircle, 420),
  A('splatter-1', 'Ink Splatter', 'Halftone & Ink', 'ink splatter splat', 400, 400, splatter(3, C.ink), 300),
  A('splatter-2', 'Blood Splatter', 'Halftone & Ink', 'blood splatter splat red', 400, 400, splatter(8, C.blood), 300),
  A('misreg-blob', 'Misprint Blob', 'Halftone & Ink', 'misregistration misprint offset print', 420, 420, misregBlob, 360),
  A('brush-stroke', 'Ink Brush Stroke', 'Halftone & Ink', 'brush stroke paint ink swash', 910, 190, brushStroke, 800),
  A('border', 'Poster Border', 'Borders', 'border frame poster ornament', 1080, 1350, border, 1080),
  A('corner', 'Corner Ornament', 'Borders', 'corner ornament flourish', 320, 320, corner, 200),
];

// ---------------------------------------------------------------- composites (graphic + editable text)
const img = (assetId: string, w: number, h: number, x = 0, y = 0, variant: Variant = 'distressed') =>
  makeImage({ kind: 'asset', assetId, variant }, w, h, { x, y, name: assetId });

const sfx = (word: string, base: string, fill: string, rot: number): CompositeAsset => ({
  kind: 'composite',
  id: `sfx-${word.toLowerCase().replace(/[^a-z]/g, '')}`,
  name: `SFX — ${word}`,
  cat: 'comic',
  group: 'Sound Effects',
  tags: ['sfx', 'sound', 'effect', 'comic', word.toLowerCase()],
  w: 420,
  h: 420,
  build: (v) => [
    img(base, 420, 420, 0, 0, v),
    makeText(word, {
      fontFamily: 'Bangers', fontSize: 120, fill, stroke: C.ink, strokeWidth: 6, extrudeDepth: 10, extrudeColor: C.ink,
      extrudeAngle: 45, letterSpacing: 2,
    }, { anchor: { cx: 210, cy: 210 }, rotation: rot, name: word }),
  ],
});

function textOn(id: string, name: string, group: string, tags: string, w: number, h: number, base: string, text: string,
  style: Parameters<typeof makeText>[1], tx: number, ty: number, rot = 0): CompositeAsset {
  return {
    kind: 'composite', id, name, cat: 'comic', group, tags: tags.split(' '), w, h,
    build: (v) => [img(base, w, h, 0, 0, v), makeText(text, style, { anchor: { cx: tx, cy: ty }, rotation: rot, name: text.split('\n')[0] })],
  };
}

export const COMIC_COMPOSITES: CompositeAsset[] = [
  sfx('BOO!', 'burst-12', C.cream, -6),
  sfx('AAAH!', 'burst-24', C.scarlet, 4),
  sfx('SLASH!', 'explosion', C.cream, -4),
  sfx('KRAK!', 'burst-navy', '#FFD86A', -8),
  sfx('SIP!', 'burst-cream', C.scarlet, 6),
  textOn('speech-text', 'Speech Bubble + Text', 'Bubbles', 'speech bubble text talk', 500, 350, 'speech-round', 'SIP IF\nYOU DARE!',
    { fontFamily: 'Bangers', fontSize: 64, fill: C.ink, lineHeight: 1 }, 250, 158),
  textOn('shout-text', 'Shout Bubble + Text', 'Bubbles', 'shout bubble text scream', 500, 360, 'speech-shout', 'WAKE UP!',
    { fontFamily: 'Bangers', fontSize: 78, fill: C.scarlet, stroke: C.ink, strokeWidth: 3 }, 250, 176, -4),
  textOn('label-text', 'Distressed Label + Text', 'Paper & Labels', 'label text distressed', 610, 220, 'label-distressed', 'HALLOWEEN SPECIAL',
    { fontFamily: 'Anton', fontSize: 64, fill: C.ink, letterSpacing: 2 }, 302, 107),
  textOn('tag-text', 'Hang Tag + Text', 'Paper & Labels', 'tag hang label text', 460, 260, 'price-tag', 'LIMITED\nBREW',
    { fontFamily: 'Special Elite', fontSize: 52, fill: C.blood, lineHeight: 1.05 }, 288, 134, 0),
  textOn('seal-text', 'Seal + Text', 'Badges', 'badge seal text', 420, 420, 'badge-scallop', 'ONE\nNIGHT\nONLY',
    { fontFamily: 'Anton', fontSize: 72, fill: C.cream, stroke: C.ink, strokeWidth: 4, lineHeight: 0.92 }, 210, 210, -8),
  textOn('ring-text', 'Ring Badge + Text', 'Badges', 'badge ring text beware', 420, 420, 'badge-ring', 'BEWARE',
    { fontFamily: 'Bowlby One SC', fontSize: 52, fill: C.blood }, 210, 210),
  ...[1, 2, 3, 4].map(
    (n): CompositeAsset => ({
      kind: 'composite', id: `panel-num-${n}`, name: `Panel Number ${n}`, cat: 'comic', group: 'Badges',
      tags: ['number', 'panel', 'comic', String(n)], w: 200, h: 200,
      build: (v): El[] => [
        img('number-disc', 200, 200, 0, 0, v),
        makeText(String(n), { fontFamily: 'Bangers', fontSize: 120, fill: C.ink }, { anchor: { cx: 100, cy: 104 }, name: `#${n}` }),
      ],
    }),
  ),
];

