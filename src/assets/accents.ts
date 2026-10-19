import { makeImage, makeRect, makeText } from '../model/factory';
import type { Variant } from '../model/types';
import { batPath } from './draw';
import { Art, C, Pt, circ, ell, line, poly, rng, starPts, wob } from './style';
import type { CompositeAsset, SvgAsset } from './types';

const A = (
  id: string, name: string, group: string, tags: string, w: number, h: number,
  draw: (v: Variant) => string, insert?: number, variants = true,
): SvgAsset => ({ kind: 'svg', id, name, cat: 'accents', group, tags: tags.split(' '), w, h, draw, insert, variants });

const CHROME = `<linearGradient id="chrome" x1="0" y1="0" x2="0.3" y2="1">
  <stop offset="0" stop-color="#FFFFFF"/><stop offset=".28" stop-color="#C9CED8"/><stop offset=".46" stop-color="#5E6577"/>
  <stop offset=".5" stop-color="#F4F6FA"/><stop offset=".7" stop-color="#9AA1B2"/><stop offset="1" stop-color="#E9ECF2"/></linearGradient>
  <linearGradient id="chromeR" x1="0" y1="0" x2="0.2" y2="1">
  <stop offset="0" stop-color="#FFE3E4"/><stop offset=".35" stop-color="#F02D35"/><stop offset=".5" stop-color="#5A0A12"/>
  <stop offset=".55" stop-color="#FFD0D2"/><stop offset=".8" stop-color="#C0182A"/><stop offset="1" stop-color="#FFB8BC"/></linearGradient>`;

function chrome(shape: (a: Art) => string, w: number, h: number, grad = 'chrome') {
  return (v: Variant) => {
    const a = new Art();
    a.defs.push(CHROME);
    const d = shape(a);
    a.raw(`<path d="${d}" fill="${C.ink}" transform="translate(8 8)"/>`, 'fills');
    a.raw(`<path d="${d}" fill="url(#${grad})" stroke="${C.ink}" stroke-width="7" stroke-linejoin="round"/>`, 'inks');
    a.hi(line([[w * 0.3, h * 0.3], [w * 0.36, h * 0.22]], 0.3, 1), 6, '#fff');
    return a.render(v, w, h);
  };
}

function retroStarburst(v: Variant) {
  const a = new Art();
  const rays = 24;
  let d = '';
  for (let i = 0; i < rays; i++) {
    const t0 = (i / rays) * Math.PI * 2, t1 = ((i + 0.5) / rays) * Math.PI * 2;
    d += poly([[250, 250], [250 + Math.cos(t0) * 245, 250 + Math.sin(t0) * 245], [250 + Math.cos(t1) * 245, 250 + Math.sin(t1) * 245]], 0, i);
  }
  a.solid(d, C.orange);
  a.shape(circ(250, 250, 90, 1.5, 3, 18), C.scarlet, { sw: 8 });
  return a.render(v, 500, 500);
}

function tinyStars(v: Variant) {
  const a = new Art();
  const r = rng(6);
  for (let i = 0; i < 9; i++) {
    const x = 30 + r() * 340, y = 30 + r() * 240, s = 10 + r() * 22;
    if (i % 3 === 0) a.stroke(poly(starPts(x, y, s, s * 0.42, 5), 0.5, i), 4);
    else a.shape(poly(starPts(x, y, s, s * 0.22, 4), 0.5, i), i % 2 ? C.cream : C.scarlet, { sw: 4 });
  }
  return a.render(v, 400, 300);
}

function scribbleCircle(v: Variant) {
  const a = new Art();
  const pts: Pt[] = [];
  for (let i = 0; i <= 60; i++) {
    const t = (i / 50) * Math.PI * 2 - 0.4;
    const k = 1 + i * 0.002;
    pts.push([250 + Math.cos(t) * 220 * k, 160 + Math.sin(t) * 120 * k]);
  }
  a.stroke(wob(pts, 3, 4, false), 9, C.scarlet);
  return a.render(v, 500, 320);
}

function scribbleUnderline(v: Variant) {
  const a = new Art();
  a.stroke(line([[20, 60], [200, 44], [480, 50], [120, 84], [420, 80], [560, 74]], 3, 2), 10, C.scarlet);
  return a.render(v, 580, 120);
}

function xMarks(v: Variant) {
  const a = new Art();
  a.stroke(line([[30, 30], [170, 170]], 2, 1), 16, C.scarlet);
  a.stroke(line([[170, 30], [34, 176]], 2, 2), 16, C.scarlet);
  return a.render(v, 200, 200);
}

function collage(v: Variant) {
  const a = new Art();
  const frame = (cx: number, cy: number, w: number, h: number, rot: number, seed: number, fill: string) => {
    const t = (rot * Math.PI) / 180;
    const tr = (p: Pt): Pt => [cx + p[0] * Math.cos(t) - p[1] * Math.sin(t), cy + p[0] * Math.sin(t) + p[1] * Math.cos(t)];
    const o = [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]].map((p) => tr(p as Pt));
    const i = [[-w / 2 + 22, -h / 2 + 22], [w / 2 - 22, -h / 2 + 22], [w / 2 - 22, h / 2 - 70], [-w / 2 + 22, h / 2 - 70]].map((p) => tr(p as Pt));
    const d = poly(o, 1.5, seed) + poly(i, 1, seed + 1);
    a.raw(`<path d="${d}" fill-rule="evenodd" fill="${C.ink}" transform="translate(8 8)" opacity=".8"/>`, 'fills');
    a.raw(`<path d="${d}" fill-rule="evenodd" fill="${fill}" stroke="${C.ink}" stroke-width="6"/>`, 'inks');
  };
  frame(200, 260, 300, 360, -8, 1, C.paper);
  a.next();
  frame(390, 240, 280, 340, 9, 3, C.cream);
  a.raw(`<path d="${poly([[310, 30], [420, 40], [416, 80], [306, 70]], 1, 2)}" fill="${C.scarlet}" opacity=".85"/>`, 'top');
  return a.render(v, 560, 480);
}

function ticket(v: Variant) {
  const a = new Art();
  const d = poly([[20, 30], [600, 30], [600, 100], [580, 130], [600, 160], [600, 230], [20, 230], [20, 160], [40, 130], [20, 100]], 1.5, 2);
  a.raw(`<path d="${d}" fill="${C.ink}" transform="translate(9 9)"/>`, 'fills');
  a.shape(d, C.scarlet, { sw: 8, shade: 0.25 });
  a.stroke('M470 44 L470 216', 4, C.cream);
  a.raw(`<path d="M470 44 L470 216" stroke="${C.ink}" stroke-width="4" stroke-dasharray="10 10"/>`, 'top');
  a.stroke(poly([[44, 52], [450, 52], [450, 208], [44, 208]], 1, 3), 3, C.cream);
  return a.render(v, 630, 260);
}

function cutoutFrame(v: Variant) {
  const a = new Art();
  const o = poly(starPts(250, 250, 245, 215, 30, 0, 0.12, 2), 0, 1);
  const i = wob(ell(250, 250, 170, 170, 18), 4, 3);
  a.raw(`<path d="${o}${i}" fill-rule="evenodd" fill="${C.cream}"/><path d="${o}${i}" fill-rule="evenodd" fill="url(#ht)" opacity=".2"/>`, 'fills');
  a.stroke(o, 8); a.stroke(i, 8);
  return a.render(v, 500, 500);
}

function dagger(v: Variant) {
  const a = new Art();
  a.shape(poly([[90, 20], [110, 20], [114, 260], [100, 300], [86, 260]], 1, 1), '#D9DDE6', { sw: 6 });
  a.stroke('M100 30 L100 250', 3, C.ink, 0.5);
  a.shape(poly([[30, 270], [170, 270], [170, 292], [30, 292]], 1, 2), C.scarlet, { sw: 6 });
  a.shape(poly([[88, 292], [112, 292], [112, 370], [88, 370]], 1, 3), C.burgundy, { sw: 6 });
  a.shape(circ(100, 382, 16, 0.5, 4), C.scarlet, { sw: 5 });
  return a.render(v, 200, 410);
}

function drop(v: Variant) {
  const a = new Art();
  a.shape(wob([[100, 20], [150, 120], [160, 170], [130, 220], [70, 220], [40, 170], [50, 120]], 1, 2), C.scarlet, { sw: 8, shade: 0.35 });
  a.hi(line([[70, 150], [80, 120]], 0.3, 1), 7);
  return a.render(v, 200, 240);
}

function lightning(v: Variant) {
  const a = new Art();
  a.shape(poly([[130, 10], [40, 170], [100, 166], [60, 330], [170, 130], [110, 134], [160, 10]], 1, 3), '#FFD86A', { sw: 8 });
  return a.render(v, 210, 340);
}

function spiralSymbol(v: Variant) {
  const a = new Art();
  const pts: Pt[] = [];
  for (let i = 0; i <= 80; i++) {
    const t = i / 80, ang = t * Math.PI * 6;
    pts.push([150 + Math.cos(ang) * 130 * t, 150 + Math.sin(ang) * 130 * t]);
  }
  a.stroke(wob(pts, 0.5, 1, false), 12);
  return a.render(v, 300, 300);
}

function sparkleRing(v: Variant) {
  const a = new Art();
  a.defs.push(CHROME);
  a.raw(`<ellipse cx="250" cy="150" rx="220" ry="60" fill="none" stroke="${C.ink}" stroke-width="20" transform="rotate(-12 250 150)"/><ellipse cx="250" cy="150" rx="220" ry="60" fill="none" stroke="url(#chrome)" stroke-width="10" transform="rotate(-12 250 150)"/>`, 'inks');
  a.next();
  const d = poly(starPts(250, 150, 110, 22, 4), 0, 1);
  a.raw(`<path d="${d}" fill="url(#chrome)" stroke="${C.ink}" stroke-width="7" stroke-linejoin="round"/>`, 'inks');
  return a.render(v, 500, 300);
}

export const ACCENTS_SVG: SvgAsset[] = [
  A('starburst-retro', 'Retro Sunburst', 'Starbursts', 'starburst sunburst rays retro', 500, 500, retroStarburst, 520),
  A('chrome-star', 'Chrome Star', 'Chrome & Y2K', 'chrome star y2k shiny metal', 300, 300, chrome(() => poly(starPts(150, 150, 140, 30, 4), 0, 1), 300, 300), 200, false),
  A('chrome-star-red', 'Red Chrome Star', 'Chrome & Y2K', 'chrome star red y2k shiny', 300, 300, chrome(() => poly(starPts(150, 150, 140, 40, 8, -Math.PI / 2, 0.15, 3), 0, 1), 300, 300, 'chromeR'), 200, false),
  A('chrome-bat', 'Chrome Bat', 'Chrome & Y2K', 'chrome bat y2k shiny metal', 400, 300, chrome(() => batPath(200, 150, 190, 'up', 4), 400, 300), 260, false),
  A('chrome-ring', 'Chrome Orbit Sparkle', 'Chrome & Y2K', 'chrome ring orbit sparkle y2k', 500, 300, sparkleRing, 320, false),
  A('tiny-stars', 'Tiny Stars', 'Stars & Scribbles', 'stars small outlined tiny', 400, 300, tinyStars, 260),
  A('scribble-circle', 'Hand-Drawn Circle', 'Stars & Scribbles', 'circle scribble hand drawn highlight', 500, 320, scribbleCircle, 460),
  A('scribble-underline', 'Scribble Underline', 'Stars & Scribbles', 'underline scribble hand drawn', 580, 120, scribbleUnderline, 460),
  A('x-mark', 'Scribbled X', 'Stars & Scribbles', 'x cross mark scribble', 200, 200, xMarks, 120),
  A('collage-frames', 'Collage Photo Frames', 'Frames & Tickets', 'collage frame photo polaroid overlap', 560, 480, collage, 520),
  A('ticket', 'Vintage Ticket', 'Frames & Tickets', 'ticket stub admit', 630, 260, ticket, 440),
  A('cutout-frame', 'Comic Cutout Frame', 'Frames & Tickets', 'frame cutout circle comic', 500, 500, cutoutFrame, 420),
  A('dagger', 'Dagger', 'Small Symbols', 'dagger knife blade symbol', 200, 410, dagger, 180),
  A('blood-drop', 'Blood Drop', 'Small Symbols', 'drop blood symbol', 200, 240, drop, 90),
  A('lightning', 'Lightning Bolt', 'Small Symbols', 'lightning bolt symbol', 210, 340, lightning, 140),
  A('spiral', 'Spiral', 'Small Symbols', 'spiral hypnotic symbol', 300, 300, spiralSymbol, 140),
];

// ---------------------------------------------------------------- composites with editable text
const sticker = (id: string, name: string, word: string, fill: string, labelFill: string, rot: number, font = 'Anton'): CompositeAsset => ({
  kind: 'composite', id, name, cat: 'accents', group: 'Stickers & Labels', tags: ['sticker', 'label', 'mini', word.toLowerCase()], w: 300, h: 120,
  build: () => [
    makeText(word, {
      fontFamily: font, fontSize: 56, fill, label: 'pill', labelFill, labelStroke: C.ink, labelPadding: 0.45,
      shadowColor: C.ink, shadowX: 6, shadowY: 6, letterSpacing: 2,
    }, { anchor: { cx: 150, cy: 60 }, rotation: rot, name: word }),
  ],
});

export const ACCENT_COMPOSITES: CompositeAsset[] = [
  sticker('sticker-new', 'Sticker — NEW!', 'NEW!', C.cream, C.scarlet, -6),
  sticker('sticker-limited', 'Sticker — LIMITED', 'LIMITED', C.ink, C.cream, 4),
  sticker('sticker-szn', 'Sticker — SPOOKY SZN', 'SPOOKY SZN', C.cream, C.violet, -3, 'Bangers'),
  sticker('sticker-tonight', 'Sticker — TONIGHT', 'TONIGHT', '#FFD86A', C.navy, 5, 'Bangers'),
  {
    kind: 'composite', id: 'label-vol', name: 'Editorial Label — VOL.', cat: 'accents', group: 'Stickers & Labels',
    tags: ['editorial', 'label', 'mini', 'issue', 'vol'], w: 260, h: 80,
    build: () => [
      makeText('VOL. 01 — HALLOWEEN', { fontFamily: 'Space Grotesk', fontStyle: 'bold', fontSize: 26, fill: C.cream, letterSpacing: 3, label: 'rect', labelFill: C.ink, labelStroke: C.cream, labelPadding: 0.5 }, { anchor: { cx: 130, cy: 40 }, name: 'VOL. 01' }),
    ],
  },
  {
    kind: 'composite', id: 'tape-strip', name: 'Marquee Type Strip', cat: 'accents', group: 'Typography Strips',
    tags: ['strip', 'tape', 'marquee', 'typography', 'banner'], w: 1200, h: 90,
    build: () => [
      makeRect(1200, 90, C.ink, { name: 'Strip', stroke: C.cream, strokeWidth: 4 }),
      makeText('HALLOWEEN SPECIAL ✦ SIP AND KILL ✦ WAKE THE DEAD ✦ HALLOWEEN SPECIAL ✦', { fontFamily: 'Anton', fontSize: 52, fill: C.cream, letterSpacing: 4 }, { anchor: { cx: 600, cy: 45 }, name: 'Strip text' }),
    ],
  },
  {
    kind: 'composite', id: 'tape-strip-red', name: 'Red Caution Strip', cat: 'accents', group: 'Typography Strips',
    tags: ['strip', 'tape', 'caution', 'typography', 'banner', 'red'], w: 1200, h: 90,
    build: () => [
      makeRect(1200, 90, C.scarlet, { name: 'Strip', stroke: C.ink, strokeWidth: 6 }),
      makeText('DO NOT CROSS ✦ DO NOT CROSS ✦ DO NOT CROSS ✦ DO NOT CROSS', { fontFamily: 'Bebas Neue', fontSize: 64, fill: C.ink, letterSpacing: 6 }, { anchor: { cx: 600, cy: 47 }, name: 'Strip text' }),
    ],
  },
  {
    kind: 'composite', id: 'ticket-text', name: 'Ticket + Text', cat: 'accents', group: 'Frames & Tickets',
    tags: ['ticket', 'admit', 'text'], w: 630, h: 260,
    build: (v) => [
      makeImage({ kind: 'asset', assetId: 'ticket', variant: v }, 630, 260, { name: 'Ticket' }),
      makeText('ADMIT ONE', { fontFamily: 'Rye', fontSize: 64, fill: C.cream, shadowColor: C.ink, shadowX: 4, shadowY: 4 }, { anchor: { cx: 250, cy: 130 }, name: 'ADMIT ONE' }),
    ],
  },
];
