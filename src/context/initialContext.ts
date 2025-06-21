import type { AppContext } from './types.ts';

export const initialAppContext: AppContext = {
  rendererRef: { current: null },

  canvas2DRef: { current: null },

  getCanvasRef: () => ({ current: null }),
  getCanvas: () => null,

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  scheduleUpdate: () => { },
};
