import { hslToRGB, rgbToColor } from '@jezvejs/color';
import { minmax } from '@jezvejs/react';
import { ALPHABET, CONTENT_LENGTH_DELTA, MIN_CONTENT_LENGTH } from './constants.ts';
import type { AppState, RendererGlitch, RendererThread } from './types.ts';

/**
 * Returns string scrolled by specified offset
 * @param {string} value
 * @param {number} offset
 * @returns {string}
 */
export const shiftString = (value: string, offset: number): string => {
  const { length } = value;
  const shift = Math.round(offset);
  if (length === 0 || shift === 0) {
    return value;
  }

  const valueEndPosition = length - shift;
  return value.substring(valueEndPosition).concat(value.substring(0, valueEndPosition));
};

/**
 * Returns hex color for specified value in the range {0; 1}
 * @param {number} value
 * @returns {string}
 */
export const getGradientColor = (value: number): string => {
  const normalizedValue = minmax(0, 1, value);
  const lightness = 95 * normalizedValue ** 2;
  const saturation = 100 * normalizedValue;

  const rgbColor = hslToRGB({
    hue: 120,
    saturation,
    lightness,
  });

  return rgbToColor(rgbColor);
};

/**
 * Returns random character from available alphabet
 * @returns {string}
 */
export const getRandomCharacter = () => (
  ALPHABET.charAt(
    Math.round(Math.random() * ALPHABET.length),
  )
);

/**
 * Returns characters area of the screen
 * @param {CanvasSizeProps} param0
 * @returns {number}
 */
export const getScreenArea = ({ columnsCount, rowsCount }: AppState): number => (
  columnsCount * rowsCount
);

const roundToPrecision = (value: number, precision: number) => {
  const base = 10 ** Math.round(precision);
  return Math.ceil(value * base) / base;
};

/**
 * Returns random characters string of specified length
 * @param {number} length
 * @returns {string}
 */
export const getRandomString = (length: number): string => {
  if (length <= 0) {
    return '';
  }

  const characters = [];
  for (let i = 0; i < length; i++) {
    characters.push(getRandomCharacter());
  }

  return characters.join('');
};

/**
 * Returns new random thread object
 * @param {AppState} state
 * @returns {RendererThread}
 */
export const getRandomThread = (state: AppState): RendererThread => {
  const { columnsCount, rowsCount, intro } = state;

  const contentLength = MIN_CONTENT_LENGTH + Math.round(Math.random() * CONTENT_LENGTH_DELTA);

  const column = Math.round(Math.random() * columnsCount);
  const row = Math.round(Math.random() * rowsCount) - (intro ? rowsCount : 0);

  // const speed = Math.ceil(Math.random() * 2) / 2; // {0.5, 1.0}
  // const speed = Math.random(); // [0.5, 1.0]
  // const speed = Math.random() * 0.5 + 0.5; // [0.5, 1.0]
  // const speed = roundToPrecision(Math.random() * 0.7 + 0.3, 1); // {0.3, 0.4, ... 0.9, 1.0}

  const speed = roundToPrecision(Math.random(), 1); // {0.1, 0.2, ... 0.9, 1.0}

  const thread: RendererThread = {
    column,
    row,
    x: column,
    y: row,
    speed,
    content: getRandomString(contentLength),
  };

  return thread;
};

/**
 * Returns new random glitch object
 * @param {AppState} param0
 * @param {boolean} randomOffset
 * @returns {RendererGlitch}
 */
export const getRandomGlitch = (
  { threads }: AppState,
  randomOffset: boolean = true,
): RendererGlitch => {
  const threadIndex = Math.round(Math.random() * (threads.length - 1));
  const thread = threads[threadIndex] ?? { column: 0, row: 0, content: '' };

  const glitchOffset = (randomOffset) ? Math.floor(Math.random() * thread.content.length) : 0;
  const remainingChars = thread.content.length - glitchOffset;

  const { column } = thread;
  const row = thread.row - glitchOffset;

  const speed = 10 + Math.round(Math.random() * thread.speed);
  const contentLength = Math.round(Math.random() * remainingChars);

  const glitch: RendererGlitch = {
    threadIndex,
    column,
    row,
    progress: 0,
    currentProgress: 0,
    speed,
    content: getRandomString(contentLength),
  };

  return glitch;
};
