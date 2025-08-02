import { createSlice } from '@jezvejs/react';
import type { AppState, CanvasSizeProps, RendererThread } from 'shared/types.ts';

export interface InitRendererProps {
  width: number;
  height: number;

  threads: RendererThread[];
}


// Reducers
const slice = createSlice<AppState>({
  setFontLoaded: (state: AppState) => ({
    ...state,
    fontLoaded: true,
  }),

  setFontLoading: (state: AppState, fontLoading: boolean) => ({
    ...state,
    fontLoading,
  }),

  resetRenderer: (state: AppState) => ({
    ...state,
    paused: true,
    updating: false,
    timestamp: 0,
    perfValue: 0,
  }),

  initRenderer: (state: AppState, props: InitRendererProps) => ({
    ...state,
    ...props,
  }),

  requestFitToScreen: (state: AppState, fitToScreenRequested = true) => ({
    ...state, fitToScreenRequested,
  }),

  setCanvasSize: (
    state: AppState,
    { canvasWidth, canvasHeight }: CanvasSizeProps,
  ): AppState => ({
    ...state,
    canvasWidth,
    canvasHeight,
    columnsCount: Math.ceil(canvasWidth / state.charWidth),
    rowsCount: Math.ceil(canvasHeight / state.charHeight),
  }),

  setTimestamp: (state: AppState, timestamp: number): AppState => ({ ...state, timestamp }),

  setPerformance: (state: AppState, perfValue: number): AppState => ({ ...state, perfValue }),

  showOffcanvas: (
    state: AppState,
    settingsVisible: boolean,
  ): AppState => ({
    ...state,
    settingsVisible,
  }),

  setUpdating: (state: AppState, updating: boolean): AppState => ({ ...state, updating }),

  pause: (state: AppState): AppState => ({ ...state, paused: true }),

  run: (state: AppState): AppState => ({ ...state, paused: false }),

  setSpeed: (state: AppState, speed: number): AppState => ({ ...state, speed }),

  setThreadsRatio: (state: AppState, threadsRatio: number): AppState => ({ ...state, threadsRatio }),

  setGlitches: (state: AppState, glitchesRatio: number): AppState => ({ ...state, glitchesRatio }),

  setFontSize: (state: AppState, fontSize: number): AppState => ({ ...state, fontSize }),

  setFontWeight: (state: AppState, fontWeight: string): AppState => ({ ...state, fontWeight }),

  setCharWidth: (state: AppState, charWidth: number): AppState => ({ ...state, charWidth }),

  setCharHeight: (state: AppState, charHeight: number): AppState => ({ ...state, charHeight }),
});

export const { actions, reducer } = slice;
