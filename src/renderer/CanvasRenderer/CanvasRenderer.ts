import { CHAR_FONT, FRAMES_PER_SECOND } from 'shared/constants.ts';
import type {
  AppState,
  Canvas,
  RendererGlitch,
  RendererThread,
  RGBAColor,
  RGBColor,
} from 'shared/types.ts';
import type { CanvasFrame } from 'renderer/CanvasFrame/CanvasFrame';
import {
  getGradientColor,
  getRandomGlitch,
  getRandomThread,
  shiftString,
} from 'shared/utils.ts';

export interface CanvasRendererProps {
  canvas: Canvas;
  threads: RendererThread[];
  glitches: RendererGlitch[];
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

    this.calculateThreads(state, timeDelta);
    this.calculateGlitches(state, timeDelta);
  }

  calculateThreads(state: AppState, timeDelta: number) {
    const { rowsCount } = state;

    this.props.threads = this.props.threads.map((thread) => {
      const { content } = thread;

      // Calculate thread movement
      const stepMove = (thread.speed * state.speed * timeDelta);
      const targetY = thread.y + stepMove;

      let result = { ...thread };
      if (targetY > rowsCount + content.length) {
        result = getRandomThread(state);
        result.y = 0;
      } else {
        result.y = targetY;

        const shift = Math.trunc(result.y) - Math.trunc(result.row);
        result.content = shiftString(content, shift);
      }
      result.row = Math.trunc(result.y);

      // Write thread content to the buffer
      const charsCount = result.content?.length ?? 0;
      for (let charIndex = 0; charIndex < charsCount; charIndex++) {
        const lightness = 1 - ((charIndex + 1) / charsCount);

        const column = Math.round(result.x);
        const row = result.row - charIndex;
        const fillStyle = getGradientColor(lightness);

        this.writeToBuffer(
          column,
          row,
          result.content?.charAt(charIndex),
          fillStyle,
        );
      }

      return result;
    });
  }

  calculateGlitches(state: AppState, timeDelta: number) {
    this.props.glitches = this.props.glitches.map((glitch) => {
      let result = { ...glitch };

      if (!this.props.threads[result.threadIndex]) {
        result.threadIndex = Math.round(Math.random() * (this.props.threads.length - 1));
      }

      const thread = this.props.threads[result.threadIndex];

      const stepMove = (result.speed * state.speed * timeDelta) / FRAMES_PER_SECOND;
      result.progress += stepMove;
      result.currentProgress += stepMove;

      const shift = Math.trunc(result.currentProgress);
      if (shift > 0) {
        result.content = shiftString(result.content, shift);
        result.currentProgress = 0;
      }

      if (
        result.progress >= result.content.length
        || (result.column !== thread.column || (result.row <= thread.row - thread.content.length))
      ) {
        result = getRandomGlitch(state, false);
      }

      const column = Math.round(result.column);
      const row = Math.round(result.row);

      this.writeToBuffer(
        column,
        row,
        result.content?.charAt(0),
      );

      return result;
    });
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

    const { canvasWidth, canvasHeight } = this.props;
    const frame = canvas.createFrame({ width: canvasWidth, height: canvasHeight });
    if (!frame) {
      return;
    }

    canvas.drawFrame(frame);

    const canvasContext = canvas.elem?.getContext('2d');
    if (!canvasContext) {
      return;
    }

    const { fontSize, fontWeight, charWidth } = state;

    canvasContext.font = `${fontWeight} ${fontSize}px ${CHAR_FONT}`;
    canvasContext.textBaseline = 'top';

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
        canvasContext.fillText(char, x, y, charWidth);
      }
    }
  }

  drawFrame(state: AppState) {
    this.drawFrameByPixels(state);
  }
}
