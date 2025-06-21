import { SCENE_SIZE } from '../../constants.ts';
import type { AppState } from '../../types.ts';

export const defaultProps = {
  autoStart: false,
  animationDelay: 10,
  width: SCENE_SIZE,
  height: SCENE_SIZE,
  threads: [],
};

export const initialState: AppState = {
  ...defaultProps,
  fitToScreenRequested: false,
  paused: true,
  settingsVisible: false,
  updating: false,
  timestamp: 0,
  perfValue: 0,
  canvasWidth: 0,
  canvasHeight: 0,
};

export const getInitialState = (props = {}, defProps = defaultProps) => ({
  ...props,
  ...defProps,
  ...initialState,
});
