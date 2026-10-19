import type { El, Variant } from '../model/types';

export type CategoryId =
  | 'yours'
  | 'characters'
  | 'decorations'
  | 'comic'
  | 'terownie'
  | 'accents';

export interface SvgAsset {
  kind: 'svg';
  id: string;
  name: string;
  cat: CategoryId;
  group: string;
  tags: string[];
  w: number;
  h: number;
  /** Size (longest side, px) when inserted on a 1080-wide canvas. */
  insert?: number;
  /** Set false for assets that look wrong distressed (e.g. chrome). */
  variants?: boolean;
  draw: (v: Variant) => string;
}

/** Inserts several editable elements at once (e.g. a badge plus its editable text). */
export interface CompositeAsset {
  kind: 'composite';
  id: string;
  name: string;
  cat: CategoryId;
  group: string;
  tags: string[];
  w: number;
  h: number;
  build: (v: Variant) => El[];
}

export type Asset = SvgAsset | CompositeAsset;
