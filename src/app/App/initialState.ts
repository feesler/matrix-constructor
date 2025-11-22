import type { AppState } from '../../shared/types.ts';

export const defaultProps = {
  autoStart: false,
  animationDelay: 10,
  threads: [],
  glitches: [],
  waveEffect: null,
};

export const initialState: AppState = {
  ...defaultProps,
  intro: true,
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
  glitchesRatio: 0.05,
  // Font settings
  fontSettingsExpanded: false,
  fontSize: 20,
  fontWeight: 'normal',
  charWidth: 20,
  charHeight: 20,
  textColorHue: 120,
  // Wave effect
  waveEffectSettingsExpanded: false,
  waveEffectOnClick: true,
  waveEffectSize: 7,
  waveEffectSpeed: 100,
};

export const getInitialState = (props = {}, defProps = defaultProps) => ({
  ...props,
  ...defProps,
  ...initialState,
});
