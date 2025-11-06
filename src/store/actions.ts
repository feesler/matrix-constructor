import { type StoreActionAPI, type StoreActionFunction } from '@jezvejs/react';

import { type AppContext } from 'context/index.ts';

import { CanvasRenderer } from 'renderer/CanvasRenderer/CanvasRenderer.ts';
import { RendererGlitch } from 'renderer/RendererGlitch/RendererGlitch.ts';
import { RendererThread } from 'renderer/RendererThread/RendererThread.ts';
import { ALPHABET, CHAR_FONT } from 'shared/constants.ts';
import { type AppState } from 'shared/types.ts';
import { getScreenArea } from 'shared/utils.ts';
import { actions } from './reducer.ts';

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
  rendererRef.current.createBuffer(st);
  rendererRef.current.updateFrame(st);
};

export const resizeCharacter = (
  context: AppContext,
): StoreActionFunction<AppState> => ({ getState, dispatch }) => {
  const { getCanvas, rendererRef } = context;
  const canvas = getCanvas();
  if (!rendererRef?.current || !canvas) {
    return;
  }

  const canvasContext = canvas.elem?.getContext('2d');
  if (!canvasContext) {
    return;
  }

  const { fontSize, fontWeight } = getState();
  canvasContext.font = `${fontWeight} ${fontSize}px ${CHAR_FONT}`;
  canvasContext.textBaseline = 'top';

  let charWidth = 0;
  let charHeight = 0;

  for (let i = 0; i < ALPHABET.length; i++) {
    const char = ALPHABET.charAt(i);
    const {
      fontBoundingBoxAscent,
      fontBoundingBoxDescent,
      width,
    } = canvasContext.measureText(char);

    charWidth = Math.max(Math.ceil(width), charWidth);
    charHeight = Math.max(
      Math.ceil(Math.abs(fontBoundingBoxAscent - fontBoundingBoxDescent)),
      charHeight,
    );
  }

  dispatch(actions.setCharWidth(charWidth));
  dispatch(actions.setCharHeight(charHeight));
};
