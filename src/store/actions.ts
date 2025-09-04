import { type StoreActionAPI, type StoreActionFunction } from '@jezvejs/react';

import { type AppContext } from 'context/index.ts';

import { CanvasRenderer } from 'renderer/CanvasRenderer/CanvasRenderer.ts';
import { RendererGlitch } from 'renderer/RendererGlitch/RendererGlitch.ts';
import { RendererThread } from 'renderer/RendererThread/RendererThread.ts';
import { type AppState } from 'shared/types.ts';
import { getScreenArea } from 'shared/utils.ts';
import { actions } from './reducer.ts';

export interface MainViewActionsAPI {
  scheduleUpdate: () => void;
  processRotation: (a: number, b: number, g: number) => void;
}

export const pause = (): StoreActionFunction<AppState> => ({ getState, dispatch }) => {
  const st = getState();
  if (st.paused) {
    return;
  }

  dispatch(actions.pause());
};

export const run = ({ scheduleUpdate }: AppContext) => ({
  getState,
  dispatch,
}: StoreActionAPI<AppState>) => {
  const st = getState();
  if (!st.paused) {
    return;
  }

  dispatch(actions.run());
  scheduleUpdate?.();
};

export const resizeBuffer = (
  context: AppContext,
): StoreActionFunction<AppState> => ({ getState, dispatch }) => {
  let st = getState();
  const {
    canvasWidth,
    canvasHeight,
    columnsCount,
    rowsCount,
  } = st;
  const screenArea = getScreenArea(st);

  const { getCanvas, rendererRef } = context;
  const canvas = getCanvas();
  if (!rendererRef || !canvas) {
    return;
  }

  // Update threads
  const threadsCount = Math.round(columnsCount * st.threadsRatio);

  let threads = st.threads
    .map((thread) => RendererThread.createCopy(thread))
    .filter((thread) => (
      (thread.column < columnsCount)
      && (thread.row < rowsCount + thread.content.length)
    ));

  const threadsBalance = threadsCount - threads.length;
  if (threadsBalance < 0) {
    threads = threads.slice(0, threadsCount);
  } else if (threadsBalance > 0) {
    for (let i = 0; i < threadsBalance; i++) {
      threads.push(RendererThread.createRandom(st));
    }
  }
  dispatch(actions.setThreads(threads));
  st = getState();

  // Update glitches
  const glitchesCount = Math.round(screenArea * st.glitchesRatio);
  let glitches = st.glitches
    .map((glitch) => RendererGlitch.createCopy(glitch))
    .filter((glitch) => (
      glitch.column < columnsCount
      && glitch.row < rowsCount
    ));

  const glitchesBalance = glitchesCount - glitches.length;
  if (glitchesBalance < 0) {
    glitches = glitches.slice(0, glitchesCount);
  } else if (glitchesBalance > 0) {
    for (let i = 0; i < glitchesBalance; i++) {
      const glitch = RendererGlitch.createRandom(st);
      if (glitch) {
        glitches.push(glitch);
      }
    }
  }
  dispatch(actions.setGlitches(glitches));
  st = getState();

  const rendererProps = {
    canvas,
    canvasWidth,
    canvasHeight,
    columnsCount,
    rowsCount,
  };

  rendererRef.current = new CanvasRenderer(rendererProps);
  rendererRef.current.drawFrame(st);
};
