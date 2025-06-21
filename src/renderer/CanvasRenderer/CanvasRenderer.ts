import type { CanvasFrame } from 'utils/CanvasFrame/CanvasFrame.ts';
import type { Canvas, RendererThread, RGBAColor, RGBColor } from '../../types.ts';
import { CHAR_FONT, CHAR_HEIGHT, CHAR_WIDTH } from '../../constants.ts';
import { getGradientColor, shiftString } from 'utils/index.ts';

export interface CanvasRendererProps {
  canvas: Canvas;
  threads: RendererThread[];
  canvasWidth: number;
  canvasHeight: number;
}

export class CanvasRenderer {
  constructor(public props: CanvasRendererProps) {
  }

  calculate() {
    const { canvasHeight } = this.props;
    const rowsCount = Math.floor(canvasHeight / CHAR_HEIGHT);

    this.props.threads = this.props.threads.map((thread) => {
      const { content } = thread;
      const result = { ...thread };

      const targetY = result.y + result.speed;

      if (targetY >= rowsCount + content.length) {
        result.y = 0;
      } else {
        const shift = Math.round(targetY) - Math.round(result.y);
        result.y = targetY;
        result.content = shiftString(content, shift);
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

    /*
    const columnsCount = Math.floor(canvasWidth / CHAR_WIDTH);
    const rowsCount = Math.floor(canvasHeight / CHAR_HEIGHT);

    for (let columnIndex = 0; columnIndex < columnsCount; columnIndex++) {
      for (let rowIndex = 0; rowIndex < rowsCount; rowIndex++) {
        const color = { r: 0, g: 255, b: 0 };

        const x = CHAR_WIDTH * columnIndex;
        const y = CHAR_HEIGHT * rowIndex;

        this.putPixel(frame, x, y, color);
      }
    }
    */

    canvas.drawFrame(frame);

    const canvasContext = canvas.elem?.getContext('2d');
    if (!canvasContext) {
      return;
    }

    canvasContext.font = `${CHAR_HEIGHT}px ${CHAR_FONT}`;

    const threadCount = this.props.threads?.length ?? 0;

    for (let threadIndex = 0; threadIndex < threadCount; threadIndex++) {
      const thread = this.props.threads[threadIndex];
      if (!thread) {
        continue;
      }

      const charsCount = thread?.content?.length ?? 0;
      for (let charIndex = 0; charIndex < charsCount; charIndex++) {
        const x = CHAR_WIDTH * Math.round(thread.x);
        const y = CHAR_HEIGHT * Math.round(thread.y - charIndex);

        const char = thread?.content?.charAt(charIndex);
        const lightness = 1 - ((charIndex + 1) / charsCount);

        canvasContext.fillStyle = getGradientColor(lightness);
        canvasContext.fillText(char, x, y, CHAR_WIDTH);
      }
    }
  }

  drawFrame() {
    this.drawFrameByPixels();
  }
}