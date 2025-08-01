import { hslToRGB, rgbToColor } from '@jezvejs/color';
import { minmax } from '@jezvejs/react';
import { ALPHABET, MAX_CONTENT_LENGTH, MIN_CONTENT_LENGTH } from '../constants.ts';
import type { AppState, RendererThread } from '../types.ts';

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
    Math.round(Math.random() * ALPHABET.length)
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

/**
 * Returns new random thread object
 * @param {AppState} param0
 * @returns {RendererThread}
 */
export const getRandomThread = ({ columnsCount, rowsCount }: AppState): RendererThread => {
  const contentLengthDelta = MAX_CONTENT_LENGTH - MIN_CONTENT_LENGTH;
  const contentLength = MIN_CONTENT_LENGTH + Math.round(Math.random() * contentLengthDelta);

  const column = Math.round(Math.random() * columnsCount);
  const row = Math.round(Math.random() * rowsCount);

  const thread: RendererThread = {
    column,
    row,
    x: column,
    y: row,
    speed: Math.random(),
    content: Array(contentLength).fill(0).map(() => getRandomCharacter()).join(''),
  };

  return thread;
};
