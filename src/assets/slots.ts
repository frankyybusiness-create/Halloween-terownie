import type { SlotId } from '../model/types';
import { C, svgDoc } from './style';

export interface SlotDef {
  id: SlotId;
  name: string;
  hint: string;
  w: number;
  h: number;
}

export const SLOTS: SlotDef[] = [
  { id: 'ghostface', name: 'Ghostface artwork', hint: 'Your own / licensed Ghostface character as a transparent PNG.', w: 520, h: 720 },
  { id: 'mascot', name: 'Terownie mascot', hint: 'The spiral-eyed Terownie mascot as a transparent PNG.', w: 520, h: 520 },
  { id: 'logo', name: 'Terownie logo', hint: 'The official Terownie logo (PNG or SVG). Never redrawn.', w: 640, h: 320 },
];

const cache = new Map<string, string>();

/** A clearly-labelled import placeholder — never pretends to be the real artwork. */
export function slotPlaceholder(id: SlotId): string {
  const hit = cache.get(id);
  if (hit) return hit;
  const s = SLOTS.find((x) => x.id === id)!;
  const { w, h } = s;
  const fs = Math.min(w, h) * 0.075;
  const lines = ['IMPORT', s.name.toUpperCase()];
  const body = `
    <rect x="8" y="8" width="${w - 16}" height="${h - 16}" rx="22" fill="${C.cream}" opacity=".92"/>
    <rect x="8" y="8" width="${w - 16}" height="${h - 16}" rx="22" fill="url(#hatch)" opacity=".08"/>
    <rect x="8" y="8" width="${w - 16}" height="${h - 16}" rx="22" fill="none" stroke="${C.ink}" stroke-width="8" stroke-dasharray="26 16"/>
    <circle cx="${w / 2}" cy="${h / 2 - fs * 1.6}" r="${fs * 1.3}" fill="${C.scarlet}" stroke="${C.ink}" stroke-width="6"/>
    <path d="M${w / 2 - fs * 0.6} ${h / 2 - fs * 1.6}h${fs * 1.2}M${w / 2} ${h / 2 - fs * 2.2}v${fs * 1.2}" stroke="${C.paper}" stroke-width="${fs * 0.28}" stroke-linecap="round"/>
    ${lines
      .map(
        (t, i) =>
          `<text x="${w / 2}" y="${h / 2 + fs * 0.6 + i * fs * 1.25}" text-anchor="middle" font-family="Arial Black, Impact, sans-serif" font-weight="900" font-size="${i ? fs : fs * 0.8}" fill="${i ? C.ink : C.blood}" letter-spacing="2">${t}</text>`,
      )
      .join('')}
    <text x="${w / 2}" y="${h - 34}" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="${fs * 0.42}" fill="${C.blood}">PLACEHOLDER · REPLACE IN “YOUR ARTWORK”</text>`;
  const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgDoc(w, h, body, 'clean'));
  cache.set(id, url);
  return url;
}
