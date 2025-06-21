import type { Canvas2DRef } from 'components/Canvas2D/Canvas2D.tsx';
import type { CanvasRenderer } from 'renderer/CanvasRenderer/CanvasRenderer.ts';

export interface AppContext {
  rendererRef: React.MutableRefObject<CanvasRenderer | null>;

  canvas2DRef: React.MutableRefObject<Canvas2DRef>;

  getCanvasRef: () => React.MutableRefObject<Canvas2DRef>;
  getCanvas: () => Canvas2DRef | null;

  scheduleUpdate: () => void;
}
