import type { CanvasFrame } from 'shared/utils/CanvasFrame/CanvasFrame.ts';
import type { AppState, Canvas, RendererThread, RGBAColor, RGBColor } from '../../shared/types.ts';
import { CHAR_FONT, CHAR_HEIGHT, CHAR_WEIGHT, CHAR_WIDTH } from '../../shared/constants.ts';
import { getGradientColor, shiftString } from 'shared/utils/index.ts';

export interface CanvasRendererProps {
  canvas: Canvas;
  threads: RendererThread[];
  canvasWidth: number;
  canvasHeight: number;
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
    const { columnsCount, rowsCount } = state;

    this.buffer = [];

    for (let columnIndex = 0; columnIndex < columnsCount; columnIndex++) {
      const column: ScreenChar[] = [];
      const x = CHAR_WIDTH * columnIndex;

      for (let rowIndex = 0; rowIndex < rowsCount; rowIndex++) {
        column.push({
          char: '',
          fillStyle: '',
          column: columnIndex,
          row: rowIndex,
          x,
          y: CHAR_HEIGHT * rowIndex,
        });
      }

      this.buffer.push(column);
    }
  }

  writeToBuffer(column: number, row: number, char: string, fillStyle: string) {
    if (column < 0 || column >= this.buffer.length) {
      return;
    }

    const bufferColumn = this.buffer[column];
    if (row < 0 || row >= bufferColumn.length) {
      return;
    }

    const screenChar = bufferColumn[row];
    screenChar.char = char;
    screenChar.fillStyle = fillStyle;
  }

  calculate(state: AppState) {
    const { canvasHeight } = this.props;
    const rowsCount = Math.floor(canvasHeight / CHAR_HEIGHT);

    this.createBuffer(state);

    this.props.threads = this.props.threads.map((thread) => {
      const { content } = thread;
      const result = { ...thread };
      const stepMove = result.speed * state.speed;
      const targetY = result.y + stepMove;

      if (targetY > rowsCount + content.length) {
        result.y = 0;
      } else {
        result.y = targetY;

        const shift = Math.trunc(result.y) - Math.trunc(result.row);
        result.content = shiftString(content, shift);
      }
      result.row = Math.trunc(result.y);

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

  drawFrameByPixels() {
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

    canvasContext.font = `${CHAR_WEIGHT} ${CHAR_HEIGHT}px ${CHAR_FONT}`;
    canvasContext.textBaseline = 'top';

    const columnsCount = this.buffer.length ?? 0;
    for (let columnIndex = 0; columnIndex < columnsCount; columnIndex++) {
      const column = this.buffer[columnIndex];
      if (!column) {
        continue;
      }

      const rowsCount = column?.length ?? 0;
      for (let rowIndex = 0; rowIndex < rowsCount; rowIndex++) {
        const { char, x, y, fillStyle } = column[rowIndex];
        if (char.length === 0) {
          continue;
        }

        canvasContext.fillStyle = fillStyle;
        canvasContext.fillText(char, x, y, CHAR_WIDTH);
      }
    }
  }

  drawFrame() {
    this.drawFrameByPixels();
  }
}