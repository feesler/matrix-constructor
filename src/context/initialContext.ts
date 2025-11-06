import type { AppContext } from './types.ts';

export const initialAppContext: AppContext = {
  rendererRef: { current: null },

  canvas2DRef: { current: null },

  getCanvasRef: () => ({ current: null }),
  getCanvas: () => null,

  scheduleUpdate: () => { },
  scheduleDraw: () => { },
};
