import type { CanvasFrame } from 'renderer/CanvasFrame/CanvasFrame';
import { RendererGlitch } from 'renderer/RendererGlitch/RendererGlitch.ts';
import { RendererThread } from 'renderer/RendererThread/RendererThread.ts';
import { CHAR_FONT } from 'shared/constants.ts';
import type {
  AppState,
  Canvas,
  RGBAColor,
  RGBColor,
} from 'shared/types.ts';
import { getGradientColor } from 'shared/utils.ts';

export interface CanvasRendererProps {
  canvas: Canvas;
  canvasWidth: number;
  canvasHeight: number;
  columnsCount: number;
  rowsCount: number;
}

export interface ScreenChar {
  char: string;
  fillStyle: string;
  column: number;
  row: number;
  x: number;
  y: number;
}

export class CanvasRenderer {
  buffer: ScreenChar[][] = [];

  constructor(public props: CanvasRendererProps) {
  }

  createBuffer(state: AppState) {
    const {
      columnsCount,
      rowsCount,
      charWidth,
      charHeight,
    } = state;

    this.buffer = [];

    for (let columnIndex = 0; columnIndex < columnsCount; columnIndex++) {
      const column: ScreenChar[] = [];
      const x = charWidth * columnIndex;

      for (let rowIndex = 0; rowIndex < rowsCount; rowIndex++) {
        column.push({
          char: '',
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

  writeToBuffer(column: number, row: number, char: string, fillStyle?: string) {
    if (column < 0 || column >= this.buffer.length) {
      return;
    }

    const bufferColumn = this.buffer[column];
    if (row < 0 || row >= bufferColumn.length) {
      return;
    }

    const screenChar = bufferColumn[row];
    screenChar.char = char;
    if (typeof fillStyle === 'string') {
      screenChar.fillStyle = fillStyle;
    }
  }

  readFromBuffer(column: number, row: number): ScreenChar | null {
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

  calculate(state: AppState, timeDelta: number) {
    this.createBuffer(state);

    let resultState = state;

    resultState = this.calculateThreads(state, timeDelta);
    resultState = this.calculateGlitches(resultState, timeDelta);

    return resultState;
  }

  /**
   * Calculates threads movement
   * @param {number} state
   * @param {number} timeDelta
   * @returns {AppState}
   */
  calculateThreads(state: AppState, timeDelta: number): AppState {
    return {
      ...state,
      threads: state.threads.map((thread) => {
        const result = thread.calculate(state, timeDelta);
        this.writeThreadToBuffer(result, state);

        return result;
      }),
    };
  }

  /**
   * Writes thread content to the buffer
   * @param {RendererThread} thread
   * @param {AppState} state
   */
  writeThreadToBuffer(thread: RendererThread, state: AppState) {
    const charsCount = thread.content?.length ?? 0;
    for (let charIndex = 0; charIndex < charsCount; charIndex++) {
      const lightness = 1 - ((charIndex + 1) / charsCount);

      const column = Math.round(thread.x);
      const row = thread.row - charIndex;
      const fillStyle = getGradientColor(lightness, state.textColorHue);

      this.writeToBuffer(
        column,
        row,
        thread.content?.charAt(charIndex),
        fillStyle,
      );
    }
  }

  /**
   * Calculates glitches update
   * @param {number} state
   * @param {number} timeDelta
   * @returns {AppState}
   */
  calculateGlitches(state: AppState, timeDelta: number): AppState {
    return {
      ...state,
      glitches: state.glitches.map((glitch) => {
        const result = glitch.calculate(state, timeDelta);
        this.writeGlitchToBuffer(result);

        return result;
      }),
    };
  }

  /**
   * Writes glitch content to the buffer
   * @param {RendererGlitch} glitch
   */
  writeGlitchToBuffer(glitch: RendererGlitch) {
    const column = Math.round(glitch.column);
    const row = Math.round(glitch.row);

    this.writeToBuffer(
      column,
      row,
      glitch.content?.charAt(0),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  reset() {
  }

  putPixel(frame: CanvasFrame, x: number, y: number, color: RGBAColor | RGBColor) {
    frame.putPixel(
      x,
      y,
      color.r,
      color.g,
      color.b,
      (('a' in color) && typeof color.a === 'number') ? color.a : 255,
    );
  }

  drawFrameByPixels(state: AppState) {
    const { canvas } = this.props;
    if (!canvas) {
      return;
    }

    const canvasContext = canvas.elem?.getContext('2d');
    if (!canvasContext) {
      return;
    }

    const { canvasWidth, canvasHeight } = this.props;
    canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);

    const {
      fontSize,
      fontWeight,
      charWidth,
      charHeight,
    } = state;
    const xOffset = charWidth / 2;
    const yOffset = charHeight / 2;

    canvasContext.font = `${fontWeight} ${fontSize}px ${CHAR_FONT}`;
    canvasContext.textAlign = 'center';
    canvasContext.textBaseline = 'middle';

    const { columnsCount, rowsCount } = this.props;
    for (let columnIndex = 0; columnIndex < columnsCount; columnIndex++) {
      for (let rowIndex = 0; rowIndex < rowsCount; rowIndex++) {
        const bufferChar = this.readFromBuffer(columnIndex, rowIndex);
        if (!bufferChar) {
          continue;
        }

        const {
          char,
          x,
          y,
          fillStyle,
        } = bufferChar;
        if (char.length === 0) {
          continue;
        }

        canvasContext.fillStyle = fillStyle;
        canvasContext.fillText(char, x + xOffset, y + yOffset, charWidth);
      }
    }
  }

  drawFrame(state: AppState) {
    this.drawFrameByPixels(state);
  }
}
