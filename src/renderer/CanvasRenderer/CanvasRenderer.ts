import type { CanvasFrame } from 'renderer/CanvasFrame/CanvasFrame';
import { ConsoleBuffer } from 'renderer/ConsoleBuffer/ConsoleBuffer.ts';
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

export class CanvasRenderer {
  buffer: ConsoleBuffer | null = null;

  constructor(public props: CanvasRendererProps) {
  }

  createBuffer(state: AppState) {
    this.buffer = new ConsoleBuffer(state);
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
    if (!this.buffer) {
      return;
    }

    const charsCount = thread.content?.length ?? 0;
    for (let charIndex = 0; charIndex < charsCount; charIndex++) {
      const lightness = 1 - ((charIndex + 1) / charsCount);

      const column = Math.round(thread.x);
      const row = thread.row - charIndex;
      const fillStyle = getGradientColor(lightness, state.textColorHue);

      this.buffer.write(
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
    if (!this.buffer) {
      return;
    }

    const column = Math.round(glitch.column);
    const row = Math.round(glitch.row);

    this.buffer.write(
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
    if (!canvas || !this.buffer) {
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
        const bufferChar = this.buffer.read(columnIndex, rowIndex);
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
