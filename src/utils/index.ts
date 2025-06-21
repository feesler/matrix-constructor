import { minmax } from '@jezvejs/react';
import { ALPHABET, CHAR_HEIGHT, CHAR_WIDTH, MAX_CONTENT_LENGTH } from '../constants.ts';
import type { CanvasSizeProps } from '../types.ts';

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

const formatColorPart = (value: number) => (
  Math.round(255 * minmax(0, 1, value)).toString(16).padStart(2, '0')
);

/**
 * Returns hex color for specified value in the range {0; 1}
 * @param {number} value
 * @returns {string}
 */
export const getGradientColor = (value: number) => {
  const lightness = 2 * value;
  const light = formatColorPart(minmax(1, 2, lightness) - 1);
  const green = formatColorPart(Math.min(lightness, 1));

  return `#${light}${green}${light}`;
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
 * Returns new random thread object
 * @param {CanvasSizeProps} param0
 * @returns {RendererThread}
 */
export const getRandomThread = ({ canvasWidth, canvasHeight }: CanvasSizeProps) => {
  const columnsCount = Math.floor(canvasWidth / CHAR_WIDTH);
  const rowsCount = Math.floor(canvasHeight / CHAR_HEIGHT);

  const contentLength = Math.round(Math.random() * MAX_CONTENT_LENGTH);

  const thread = {
    x: Math.round(Math.random() * columnsCount),
    y: Math.round(Math.random() * rowsCount),
    speed: Math.random() + 0.5,
    content: Array(contentLength).fill(0).map(() => getRandomCharacter()).join(''),
  };

  return thread;
};
