import { hslToRGB, rgbToColor } from '@jezvejs/color';
import { minmax } from '@jezvejs/react';
import { ALPHABET } from './constants.ts';
import type { AppState } from './types.ts';

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

/**
 * Returns number rounded to the specified precision
 * @param {number} value
 * @param {number} precision
 * @returns {number}
 */
export const roundToPrecision = (value: number, precision: number) => {
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
