import type { Canvas2DElement } from 'components/Canvas2D/Canvas2D.tsx';
import { RendererGlitch } from 'renderer/RendererGlitch/RendererGlitch.ts';
import { RendererThread } from 'renderer/RendererThread/RendererThread.ts';
import { RendererWave } from 'renderer/RendererWave/RendererWave.ts';

export interface IdObject {
  id: string;
}

/**
 * Coordinates point
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * RGB color
 */
export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

/**
 * RGBA color
 */
export interface RGBAColor extends RGBColor {
  a: number;
}

export type MenuItemCallback = <
  T extends object = object,
  R = boolean,
>(item: T, index?: number, arr?: T[]) => R;

/**
 * shouldIncludeParentItem() function params
 */
export interface IncludeGroupItemsParam {
  includeGroupItems?: boolean;
  includeChildItems?: boolean;
}

/**
 * toFlatList() function params
 */
export interface ToFlatListParam extends IncludeGroupItemsParam {
  disabled?: boolean;
}

/**
 * forItems() function params
 */
export interface MenuLoopParam<
  T extends object = object,
> extends IncludeGroupItemsParam {
  group?: T | null;
}

export type Canvas = Canvas2DElement;

export interface View {
  canvas: Canvas;
}

export interface CanvasSizeProps {
  canvasWidth: number;
  canvasHeight: number;
}

export interface AppState {
  fontLoaded: boolean;
  fontLoading: boolean;

  autoStart: boolean;
  intro: boolean;

  animationDelay: number;

  // Size of canvas in pixels
  canvasWidth: number;
  canvasHeight: number;

  // Size of canvas in characters
  columnsCount: number;
  rowsCount: number;

  // Font settings
  fontSettingsExpanded: boolean;
  fontSize: number;
  fontWeight: string;

  charWidth: number;
  charHeight: number;

  // Text color
  textColorHue: number;

  threads: RendererThread[];
  threadsRatio: number;
  speed: number;

  glitches: RendererGlitch[];
  glitchesRatio: number;

  // Wave effect
  waveEffectSettingsExpanded: boolean;
  waveEffect: RendererWave | null;
  waveEffectOnClick: boolean;
  waveEffectSize: number;
  waveEffectSpeed: number;

  fitToScreenRequested: boolean;

  paused: boolean;
  updating: boolean;

  timestamp: number;
  perfValue: number;

  settingsVisible: boolean;
}
