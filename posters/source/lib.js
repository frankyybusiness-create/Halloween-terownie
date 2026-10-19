// Shared helpers for the Terownie poster sources (canvas layers + HTML text layers).
const W = 1080, H = 1350, P = document.getElementById('p');
const ROOT = '/home/user/Halloween-terownie/';

function layer(name, z, blend) {
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  c.dataset.layer = name; c.style.zIndex = z; if (blend) c.style.mixBlendMode = blend;
  P.appendChild(c); return c.getContext('2d');
}
function div(name, z, css, html) {
  const d = document.createElement('div'); d.dataset.layer = name;
  d.style.cssText += `z-index:${z};` + css; d.innerHTML = html || ''; P.appendChild(d); return d;
}
function rng(s) { return () => { s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const load = (u) => new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = u; });
const loadSvg = (s) => load('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s));
function canvas(w, h) { const c = document.createElement('canvas'); c.width = Math.ceil(w); c.height = Math.ceil(h); return c; }

/** Smooth noise field image, w x h, cell size in px. */
function noiseCanvas(w, h, cell, seed) {
  const n = canvas(Math.ceil(w / cell) + 2, Math.ceil(h / cell) + 2), nc = n.getContext('2d');
  const id = nc.createImageData(n.width, n.height), r = rng(seed);
  for (let i = 0; i < id.data.length; i += 4) { const v = r() * 255; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; }
  nc.putImageData(id, 0, 0);
  const o = canvas(w, h), oc = o.getContext('2d'); oc.imageSmoothingQuality = 'high'; oc.drawImage(n, 0, 0, w, h); return o;
}

/**
 * Halftone a source image. Brighter (or darker with invert) source -> bigger dots of `color`,
 * over an optional solid `plate` of the silhouette. Adds lighting falloff + grit so flat art reads as print.
 */
function halftone(ctx, src, x, y, w, h, o = {}) {
  const { color, plate, spacing = 7, gain = 1.4, flip = false, rot = 0, invert = false, lx = .3, ly = .2, light = 1, grit = .8, seed = 1, angle = 45, alpha = 1 } = o;
  const s = canvas(w, h), c = s.getContext('2d');
  if (flip) { c.translate(w, 0); c.scale(-1, 1); }
  c.filter = 'blur(1.2px)'; c.drawImage(src, 0, 0, w, h); c.filter = 'none';
  const d = c.getImageData(0, 0, s.width, s.height).data;
  const nd = noiseCanvas(s.width, s.height, 22, seed).getContext('2d').getImageData(0, 0, s.width, s.height).data;
  const out = canvas(w, h), oc = out.getContext('2d');
  if (plate) { oc.drawImage(s, 0, 0); oc.globalCompositeOperation = 'source-in'; oc.fillStyle = plate; oc.fillRect(0, 0, w, h); oc.globalCompositeOperation = 'source-over'; }
  oc.fillStyle = color; oc.beginPath();
  const t = angle * Math.PI / 180, gr = rng(seed + 9);
  for (let gy = -2 * h; gy < 2 * h; gy += spacing) for (let gx = -2 * w; gx < 2 * w; gx += spacing) {
    const px = w / 2 + gx * Math.cos(t) - gy * Math.sin(t), py = h / 2 + gx * Math.sin(t) + gy * Math.cos(t);
    if (px < 0 || py < 0 || px >= w || py >= h) continue;
    const k = ((py | 0) * s.width + (px | 0)) * 4, a = d[k + 3] / 255; if (a < .05) continue;
    let l = (.299 * d[k] + .587 * d[k + 1] + .114 * d[k + 2]) / 255; if (invert) l = 1 - l;
    const lit = 1 - light * (Math.hypot(px / w - lx, py / h - ly) - .35);
    l = l * Math.max(.1, lit) * (1 - grit * .45 + grit * .9 * nd[k] / 255) * (.85 + gr() * .3);
    const r = spacing * .64 * Math.min(1, Math.sqrt(Math.max(0, l)) * gain) * a; if (r < .4) continue;
    oc.moveTo(px + r, py); oc.arc(px, py, r, 0, 7);
  }
  oc.fill();
  ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x + w / 2, y + h / 2); ctx.rotate(rot); ctx.drawImage(out, -w / 2, -h / 2); ctx.restore();
}

/** Two-colour (duotone) photo treatment: dark -> c0, light -> c1. */
function duotone(ctx, src, x, y, w, h, c0, c1, { contrast = 1.2, rot = 0, alpha = 1 } = {}) {
  const s = canvas(w, h), c = s.getContext('2d'); c.drawImage(src, 0, 0, w, h);
  const id = c.getImageData(0, 0, s.width, s.height), d = id.data;
  const p = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)); const A = p(c0), B = p(c1);
  for (let i = 0; i < d.length; i += 4) {
    let l = (.299 * d[i] + .587 * d[i + 1] + .114 * d[i + 2]) / 255; l = Math.min(1, Math.max(0, (l - .5) * contrast + .5));
    for (let k = 0; k < 3; k++) d[i + k] = A[k] + (B[k] - A[k]) * l;
  }
  c.putImageData(id, 0, 0);
  ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x + w / 2, y + h / 2); ctx.rotate(rot); ctx.drawImage(s, -w / 2, -h / 2); ctx.restore();
}

/** Knock random specks + worn patches out of a layer (screen-print ink wear). */
function inkWear(ctx, amount = .5, seed = 3) {
  const n = noiseCanvas(W, H, 3, seed).getContext('2d').getImageData(0, 0, W, H).data;
  const b = noiseCanvas(W, H, 90, seed + 1).getContext('2d').getImageData(0, 0, W, H).data;
  const id = ctx.getImageData(0, 0, W, H), d = id.data;
  for (let i = 0; i < d.length; i += 4) {
    const v = n[i] / 255, big = b[i] / 255;
    if (v > 1 - amount * .35 - Math.max(0, big - .6) * amount) d[i + 3] *= .1;
  }
  ctx.putImageData(id, 0, 0);
}

/** The event's printed-canvas finish: warm grain + weave, multiply. */
function retroFinish(z = 50, strength = 1) {
  const g = layer('zz-retro-texture', z, 'multiply');
  const id = g.createImageData(W, H), r = rng(77), d = id.data;
  const blot = noiseCanvas(W, H, 140, 5).getContext('2d').getImageData(0, 0, W, H).data;
  for (let y = 0, i = 0; y < H; y++) for (let x = 0; x < W; x++, i += 4) {
    const weave = ((x % 4 < 2) ^ (y % 4 < 2)) ? 6 : 0;
    const v = 255 - (r() * 34 + weave + (blot[i] / 255) * 26) * strength;
    d[i] = v; d[i + 1] = v * .96; d[i + 2] = v * .88; d[i + 3] = 255;
  }
  g.putImageData(id, 0, 0);
  const o = layer('zz-film-grain', z + 1, 'overlay'), od = o.createImageData(W, H), r2 = rng(78);
  for (let i = 0; i < od.data.length; i += 4) { const v = 128 + (r2() + r2() + r2() - 1.5) * 60 * strength; od.data[i] = od.data[i + 1] = od.data[i + 2] = v; od.data[i + 3] = 255; }
  o.putImageData(od, 0, 0);
}

/** Uniform dark dot-screen over the whole poster (the "screen door" look). */
function dotScreen(z, color = 'rgba(0,0,0,.55)', spacing = 7, r = 1.6) {
  const s = layer('zz-dot-screen', z); s.fillStyle = color; s.beginPath();
  for (let y = 0; y < H; y += spacing) for (let x = 0; x < W; x += spacing) { s.moveTo(x + r, y); s.arc(x, y, r, 0, 7); }
  s.fill(); return s;
}

function tornPath(w, h, seed) { const r = rng(seed); let d = `M0 ${4 + r() * 8}`; for (let x = 0; x <= w; x += 12) d += `L${x} ${r() * 10}`; d += `L${w} ${h - r() * 8}`; for (let x = w; x >= 0; x -= 12) d += `L${x} ${h - r() * 10}`; return d + 'Z'; }
function strip(name, z, left, top, w, h, seed, fill, html, rot = 0, css = '') {
  return div(name, z, `left:${left}px;top:${top}px;width:${w}px;height:${h}px;transform:rotate(${rot}deg)`,
    `<svg width="${w}" height="${h}" style="position:absolute;inset:0;overflow:visible"><path d="${tornPath(w, h, seed)}" fill="${fill}"/></svg><div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;align-items:center;${css}">${html}</div>`);
}
async function fonts(list) { for (const f of list) await document.fonts.load(f); }
