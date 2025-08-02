import { type StoreActionAPI, type StoreActionFunction } from '@jezvejs/react';

import { type AppContext } from 'context/index';

import { type AppState } from 'shared/types.ts';
import { actions } from './reducer.ts';
import { getRandomGlitch, getRandomThread, getScreenArea } from 'shared/utils/index.ts';
import { MAX_CONTENT_LENGTH } from 'shared/constants.ts';
import { CanvasRenderer } from 'renderer/CanvasRenderer/CanvasRenderer.ts';

export interface MainViewActionsAPI {
  scheduleUpdate: () => void;
  processRotation: (a: number, b: number, g: number) => void;
};

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

export const resizeBuffer = (context: AppContext): StoreActionFunction<AppState> => ({ getState }) => {
  const st = getState();
  const { canvasWidth, canvasHeight, columnsCount, rowsCount } = st;
  const screenArea = getScreenArea(st);
  const threadsCount = Math.round((screenArea / MAX_CONTENT_LENGTH) * st.threadsRatio);
  const glitchesCount = Math.round(threadsCount * st.glitchesRatio);

  const { getCanvas, rendererRef } = context;
  const canvas = getCanvas();
  if (!rendererRef || !canvas) {
    return;
  }

  const rendererProps = {
    canvas,
    threads: Array(threadsCount).fill(0).map(() => getRandomThread(st)),
    glitches: Array(glitchesCount).fill(0).map(() => getRandomGlitch(st)),
    canvasWidth,
    canvasHeight,
    columnsCount,
    rowsCount,
  };

  rendererRef.current = new CanvasRenderer(rendererProps);
  rendererRef.current.drawFrame(st);
};
