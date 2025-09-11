import { minmax } from '@jezvejs/react';
import { ALPHABET, LEADING_GLOW_THRESHOLD } from './constants.ts';
import type { AppState, Point } from './types.ts';

/**
 * Returns array of Touch objects for specified event
 * @param {React.TouchEvent} e
 * @returns {React.Touch[]}
 */
export const getEventTouches = (e: React.TouchEvent): React.Touch[] => {
  const touches = (e.type === 'touchend' || e.type === 'touchcancel')
    ? e.changedTouches
    : e.touches;

  return Array.from(touches);
};

/**
 * Returns object containing coordinates depending on event type
 * @param {React.TouchEvent | React.MouseEvent} e
 * @returns {React.Touch | React.MouseEvent}
 */
export const getEventCoordinatesObject = (
  e: React.TouchEvent | React.MouseEvent,
): React.Touch | React.MouseEvent => {
  if ('touches' in e) {
    const [touch] = getEventTouches(e);
    return touch;
  }

  return e;
};

/**
 * Returns page coordinates from specified object
 * @param {React.Touch | React.MouseEvent} source
 * @returns {Point}
 */
export const getPageCoordinates = (source: React.Touch | React.MouseEvent): Point => ({
  x: source.pageX,
  y: source.pageY,
});

/**
 * Returns client coordinates for specified object
 * @param {React.Touch | React.MouseEvent} source
 * @returns {Point}
 */
export const getClientCoordinates = (source: React.Touch | React.MouseEvent): Point => ({
  x: source.clientX,
  y: source.clientY,
});

/**
 * Returns page coordinates for specified event
 * @param {React.TouchEvent | React.MouseEvent} e
 * @returns {Point}
 */
export const getEventPageCoordinates = (e: React.TouchEvent | React.MouseEvent): Point => {
  const coords = getEventCoordinatesObject(e);
  return getPageCoordinates(coords);
};

/**
 * Returns client coordinates for specified event
 * @param {React.TouchEvent | React.MouseEvent} e
 * @returns {Point}
 */
export const getEventClientCoordinates = (e: React.TouchEvent | React.MouseEvent): Point => {
  const coords = getEventCoordinatesObject(e);
  return getClientCoordinates(coords);
};

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
 * @param {number} hue
 * @returns {string}
 */
export const getGradientColor = (value: number, hue: number): string => {
  const normalizedValue = minmax(0, 1, value);
  const isLeadingGlow = normalizedValue > LEADING_GLOW_THRESHOLD;

  const normalizedHue = minmax(0, 360, hue);

  const lightness = (isLeadingGlow)
    ? (90 * normalizedValue)
    : (75 * normalizedValue ** 2);

  const saturation = (isLeadingGlow)
    ? (100 * normalizedValue ** 2)
    : (100 * normalizedValue);

  return `hsl(${normalizedHue}deg, ${saturation}%, ${lightness}%)`;
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
