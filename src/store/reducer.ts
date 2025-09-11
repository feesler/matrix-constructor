import { createSlice } from '@jezvejs/react';
import { RendererGlitch } from 'renderer/RendererGlitch/RendererGlitch.ts';
import { RendererThread } from 'renderer/RendererThread/RendererThread.ts';
import { RendererWave } from 'renderer/RendererWave/RendererWave.ts';
import { WAVE_EFFECT_WIDTH } from 'shared/constants.ts';
import type {
  AppState,
  CanvasSizeProps,
} from 'shared/types.ts';
import { getEventPageCoordinates } from 'shared/utils.ts';

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
    threads: [],
    glitches: [],
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

  setIntro: (state: AppState, intro: boolean) => ({ ...state, intro }),

  setSpeed: (state: AppState, speed: number): AppState => ({ ...state, speed }),

  setThreads: (state: AppState, threads: RendererThread[]): AppState => ({
    ...state,
    threads,
  }),

  setThreadsRatio: (state: AppState, threadsRatio: number): AppState => ({
    ...state,
    threadsRatio,
  }),

  setGlitches: (state: AppState, glitches: RendererGlitch[]): AppState => ({
    ...state,
    glitches,
  }),

  setGlitchesRatio: (state: AppState, glitchesRatio: number): AppState => ({
    ...state,
    glitchesRatio,
  }),

  setWaveEffect: (state: AppState, waveEffect: RendererWave | null): AppState => ({
    ...state,
    waveEffect,
  }),

  setFontSize: (state: AppState, fontSize: number): AppState => ({ ...state, fontSize }),

  setFontWeight: (state: AppState, fontWeight: string): AppState => ({ ...state, fontWeight }),

  setCharWidth: (state: AppState, charWidth: number): AppState => ({ ...state, charWidth }),

  setCharHeight: (state: AppState, charHeight: number): AppState => ({ ...state, charHeight }),

  setHue: (state: AppState, textColorHue: number): AppState => ({ ...state, textColorHue }),

  mouseDown: (state: AppState, e: React.MouseEvent): AppState => {
    const coords = getEventPageCoordinates(e);

    const column = Math.round(coords.x / state.charWidth);
    const row = Math.round(coords.y / state.charHeight);

    return {
      ...state,
      waveEffect: new RendererWave(column, row, WAVE_EFFECT_WIDTH),
    };
  },
});

export const { actions, reducer } = slice;
