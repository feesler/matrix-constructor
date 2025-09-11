import { AppState } from 'shared/types.ts';

export interface ScreenChar {
  char: string;
  lightness: number;
  fillStyle: string;
  column: number;
  row: number;
  x: number;
  y: number;
}

/**
 * Console screen butter class
 */
export class ConsoleBuffer {
  buffer: ScreenChar[][] = [];

  constructor(state: AppState) {
    const {
      columnsCount,
      rowsCount,
      charWidth,
      charHeight,
    } = state;

    for (let columnIndex = 0; columnIndex < columnsCount; columnIndex++) {
      const column: ScreenChar[] = [];
      const x = charWidth * columnIndex;

      for (let rowIndex = 0; rowIndex < rowsCount; rowIndex++) {
        column.push({
          char: '',
          lightness: 0,
          fillStyle: '',
          column: columnIndex,
          row: rowIndex,
          x,
          y: charHeight * rowIndex,
        });
      }

      this.buffer.push(column);
    }
  }

  /**
   * Writes screen character and related style to the specified position
   * @param {number} column
   * @param {number} row
   * @param {string} char
   * @param {number} lightness
   * @param {string} fillStyle
   */
  write(column: number, row: number, char: string, lightness?: number, fillStyle?: string) {
    if (column < 0 || column >= this.buffer.length) {
      return;
    }

    const bufferColumn = this.buffer[column];
    if (row < 0 || row >= bufferColumn.length) {
      return;
    }

    const screenChar = bufferColumn[row];
    screenChar.char = char;
    if (typeof lightness === 'number') {
      screenChar.lightness = lightness;
    }
    if (typeof fillStyle === 'string') {
      screenChar.fillStyle = fillStyle;
    }
  }

  /**
   * Returns screen character from specified position or null if position is invalid
   * @param {number} column
   * @param {number} row
   * @returns {ScreenChar | null}
   */
  read(column: number, row: number): ScreenChar | null {
    if (column < 0 || column >= this.buffer.length) {
      return null;
    }

    const bufferColumn = this.buffer[column];
    if (row < 0 || row >= bufferColumn.length) {
      return null;
    }

    const screenChar = bufferColumn[row];
    return {
      ...screenChar,
    };
  }
}
