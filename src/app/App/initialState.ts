import { SCENE_SIZE } from '../../shared/constants.ts';
import type { AppState } from '../../shared/types.ts';

export const defaultProps = {
  autoStart: false,
  animationDelay: 10,
  width: SCENE_SIZE,
  height: SCENE_SIZE,
  threads: [],
  glitches: [],
};

export const initialState: AppState = {
  ...defaultProps,
  fontLoaded: false,
  fontLoading: false,
  fitToScreenRequested: false,
  paused: true,
  settingsVisible: false,
  updating: false,
  timestamp: 0,
  perfValue: 0,
  canvasWidth: 0,
  canvasHeight: 0,
  columnsCount: 0,
  rowsCount: 0,
  speed: 40,
  threadsRatio: 1.5,
  glitchesRatio: 0.02,
  fontSize: 18,
  fontWeight: 'normal',
  charWidth: 10,
  charHeight: 18,
};

export const getInitialState = (props = {}, defProps = defaultProps) => ({
  ...props,
  ...defProps,
  ...initialState,
});
