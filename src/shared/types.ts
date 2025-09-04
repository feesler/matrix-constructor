import { RendererGlitch } from 'renderer/RendererGlitch/RendererGlitch.ts';
import { RendererThread } from 'renderer/RendererThread/RendererThread.ts';
import type { Canvas2DElement } from '../components/Canvas2D/Canvas2D.tsx';

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

  width: number;
  height: number;

  fontSize: number;
  fontWeight: string;

  charWidth: number;
  charHeight: number;

  threads: RendererThread[];
  threadsRatio: number;
  speed: number;

  glitches: RendererGlitch[];
  glitchesRatio: number;

  fitToScreenRequested: boolean;

  paused: boolean;
  updating: boolean;

  timestamp: number;
  perfValue: number;

  settingsVisible: boolean;
}
