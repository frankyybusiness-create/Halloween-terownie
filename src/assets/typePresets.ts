import type { TextStyle } from '../model/types';
import { C } from './style';

export interface TypePreset {
  id: string;
  name: string;
  group: 'Headlines' | 'Effects' | 'Labels & Stickers' | 'Info Text';
  text: string;
  style: Partial<TextStyle>;
}

export const FONTS = [
  { family: 'Anton', note: 'Condensed poster' },
  { family: 'Bebas Neue', note: 'Underground condensed' },
  { family: 'Oswald', note: 'Condensed info' },
  { family: 'Bangers', note: 'Comic titles' },
  { family: 'Creepster', note: 'Horror drip' },
  { family: 'Nosifer', note: 'Bloody horror' },
  { family: 'Metal Mania', note: 'Blackletter-ish' },
  { family: 'Rye', note: 'Vintage wood type' },
  { family: 'Bowlby One SC', note: 'Heavy display' },
  { family: 'Archivo Black', note: 'Grotesk black' },
  { family: 'Shrikhand', note: 'Retro script' },
  { family: 'Rubik Dirt', note: 'Distressed' },
  { family: 'Rubik Glitch', note: 'Glitch' },
  { family: 'Special Elite', note: 'Typewriter' },
  { family: 'Permanent Marker', note: 'Hand marker' },
  { family: 'Space Grotesk', note: 'Editorial sans' },
];

export const RANSOM_FONTS = ['Anton', 'Rye', 'Bangers', 'Special Elite', 'Archivo Black', 'Shrikhand', 'Bowlby One SC', 'Creepster'];

export const TYPE_PRESETS: TypePreset[] = [
  {
    id: 'wake-the-dead', name: 'WAKE THE DEAD — Horror Stack', group: 'Headlines', text: 'WAKE\nTHE DEAD',
    style: {
      fontFamily: 'Anton', fontSize: 210, fill: C.cream, lineHeight: 0.88, letterSpacing: 2,
      stroke: C.ink, strokeWidth: 7, outline2: C.scarlet, outline2Width: 8,
      extrudeColor: C.burgundy, extrudeDepth: 16, extrudeAngle: 55, shadowColor: C.ink, shadowX: 22, shadowY: 26,
      misregColor: C.navy, misregOffset: 0, inkWear: 0.25,
    },
  },
  {
    id: 'sip-and-kill', name: 'SIP AND KILL — Comic Arch', group: 'Headlines', text: 'SIP AND KILL',
    style: {
      fontFamily: 'Bangers', fontSize: 120, fill: '#FFD86A', letterSpacing: 4, mode: 'arc', arc: 40,
      stroke: C.ink, strokeWidth: 6, outline2: C.cream, outline2Width: 6, extrudeColor: C.ink, extrudeDepth: 10, extrudeAngle: 45,
    },
  },
  {
    id: 'vintage-horror', name: 'Vintage Horror Headline', group: 'Headlines', text: 'NIGHT OF\nTERROR',
    style: { fontFamily: 'Creepster', fontSize: 150, fill: C.scarlet, lineHeight: 0.95, stroke: C.ink, strokeWidth: 5, shadowColor: C.ink, shadowX: 10, shadowY: 12 },
  },
  {
    id: 'underground', name: 'Underground Condensed', group: 'Headlines', text: 'HOUSE PARTY',
    style: { fontFamily: 'Bebas Neue', fontSize: 160, fill: C.cream, letterSpacing: 6, misregColor: C.scarlet, misregOffset: 7, inkWear: 0.2 },
  },
  {
    id: 'comic-title', name: 'Retro Comic Title', group: 'Headlines', text: 'TALES FROM\nTHE CAFÉ',
    style: {
      fontFamily: 'Bangers', fontSize: 130, fill: '#FFD86A', lineHeight: 0.92, letterSpacing: 3,
      stroke: C.ink, strokeWidth: 6, extrudeColor: C.scarlet, extrudeDepth: 12, extrudeAngle: 40,
    },
  },
  {
    id: 'blood-drip', name: 'Bloody Drip Title', group: 'Headlines', text: 'HALLOWEEN',
    style: { fontFamily: 'Nosifer', fontSize: 100, fill: C.scarlet, stroke: C.ink, strokeWidth: 4, shadowColor: C.burgundy, shadowX: 6, shadowY: 8 },
  },
  {
    id: 'ransom', name: 'Ransom-Note Cutout', group: 'Effects', text: 'SIP AND KILL',
    style: { fontFamily: 'Anton', fontSize: 92, fill: C.ink, mode: 'ransom', warp: 0.7, letterSpacing: 10, shadowColor: C.ink, shadowX: 5, shadowY: 6 },
  },
  {
    id: 'warped', name: 'Warped Irregular Lettering', group: 'Effects', text: 'WAKE THE DEAD',
    style: { fontFamily: 'Archivo Black', fontSize: 100, fill: C.cream, mode: 'warp', warp: 0.8, stroke: C.ink, strokeWidth: 5, shadowColor: C.blood, shadowX: 8, shadowY: 8 },
  },
  {
    id: 'arched', name: 'Arched Headline', group: 'Effects', text: 'A HALLOWEEN POP-UP',
    style: { fontFamily: 'Rye', fontSize: 64, fill: C.cream, mode: 'arc', arc: 70, letterSpacing: 4, stroke: C.ink, strokeWidth: 4 },
  },
  {
    id: 'smile-curve', name: 'Downward Curve', group: 'Effects', text: 'BY TEROWNIE',
    style: { fontFamily: 'Bebas Neue', fontSize: 80, fill: C.scarlet, mode: 'arc', arc: -50, letterSpacing: 8, stroke: C.ink, strokeWidth: 3 },
  },
  {
    id: 'layered-outlines', name: 'Layered Outlines', group: 'Effects', text: 'BOO!',
    style: { fontFamily: 'Bowlby One SC', fontSize: 160, fill: C.orange, stroke: C.ink, strokeWidth: 8, outline2: C.cream, outline2Width: 10, shadowColor: C.ink, shadowX: 12, shadowY: 12 },
  },
  {
    id: 'offset-shadow', name: 'Offset Shadow', group: 'Effects', text: 'SPOOKY',
    style: { fontFamily: 'Anton', fontSize: 150, fill: C.cream, shadowColor: C.scarlet, shadowX: 12, shadowY: 12, letterSpacing: 4 },
  },
  {
    id: 'double-outline', name: 'Double Outline', group: 'Effects', text: 'FEAR',
    style: { fontFamily: 'Archivo Black', fontSize: 170, fill: C.ink, stroke: C.scarlet, strokeWidth: 6, outline2: C.ink, outline2Width: 8 },
  },
  {
    id: 'extruded', name: 'Extruded 3D', group: 'Effects', text: 'DEAD',
    style: { fontFamily: 'Bowlby One SC', fontSize: 170, fill: C.scarlet, stroke: C.ink, strokeWidth: 6, extrudeColor: C.ink, extrudeDepth: 24, extrudeAngle: 60 },
  },
  {
    id: 'rough-ink', name: 'Rough Ink', group: 'Effects', text: 'CURSED',
    style: { fontFamily: 'Rubik Dirt', fontSize: 150, fill: C.cream, inkWear: 0.55, misregColor: C.scarlet, misregOffset: 6 },
  },
  {
    id: 'misprint', name: 'Misprint Registration', group: 'Effects', text: 'EVPHORIA',
    style: { fontFamily: 'Rubik Glitch', fontSize: 120, fill: C.cream, misregColor: C.violet, misregOffset: 8, letterSpacing: 2 },
  },
  {
    id: 'sticker-pill', name: 'Sticker Pill', group: 'Labels & Stickers', text: 'HALLOWEEN SPECIAL',
    style: { fontFamily: 'Anton', fontSize: 52, fill: C.cream, letterSpacing: 3, label: 'pill', labelFill: C.scarlet, labelStroke: C.ink, shadowColor: C.ink, shadowX: 6, shadowY: 6 },
  },
  {
    id: 'sticker-burst', name: 'Burst Sticker', group: 'Labels & Stickers', text: 'NEW!',
    style: { fontFamily: 'Bangers', fontSize: 72, fill: C.ink, label: 'burst', labelFill: '#FFD86A', labelStroke: C.ink, labelPadding: 0.7 },
  },
  {
    id: 'tag-label', name: 'Tag Label', group: 'Labels & Stickers', text: 'A HALLOWEEN POP-UP BY TEROWNIE',
    style: { fontFamily: 'Oswald', fontStyle: 'bold', fontSize: 40, fill: C.ink, letterSpacing: 3, label: 'tag', labelFill: C.cream, labelStroke: C.ink, shadowColor: C.blood, shadowX: 6, shadowY: 6 },
  },
  {
    id: 'torn-label', name: 'Torn Paper Label', group: 'Labels & Stickers', text: 'OCTOBER 30, 2026',
    style: { fontFamily: 'Special Elite', fontSize: 48, fill: C.ink, label: 'torn', labelFill: C.cream, labelStroke: C.ink },
  },
  {
    id: 'box-label', name: 'Boxed Editorial Label', group: 'Labels & Stickers', text: 'PUMP.BOYZ × EVPHORIA',
    style: { fontFamily: 'Space Grotesk', fontStyle: 'bold', fontSize: 40, fill: C.cream, letterSpacing: 2, label: 'rect', labelFill: C.ink, labelStroke: C.cream },
  },
  {
    id: 'info-block', name: 'Event Info Block', group: 'Info Text', text: 'OCTOBER 30, 2026 · 3 PM\nTWIN-PEAKS MOUNTAIN\nBRGY. DAPDAP, TAYABAS CITY',
    style: { fontFamily: 'Oswald', fontStyle: 'bold', fontSize: 40, fill: C.cream, lineHeight: 1.2, letterSpacing: 2 },
  },
  {
    id: 'handle', name: 'Instagram Handle', group: 'Info Text', text: '@TEROWNIE_CAFE',
    style: { fontFamily: 'Space Grotesk', fontStyle: 'bold', fontSize: 38, fill: C.cream, letterSpacing: 2 },
  },
  {
    id: 'typewriter', name: 'Typewriter Note', group: 'Info Text', text: 'come thirsty. leave haunted.',
    style: { fontFamily: 'Special Elite', fontSize: 40, fill: C.cream },
  },
  {
    id: 'marker', name: 'Hand Marker Note', group: 'Info Text', text: 'see you there!!',
    style: { fontFamily: 'Permanent Marker', fontSize: 48, fill: '#FFD86A' },
  },
];
