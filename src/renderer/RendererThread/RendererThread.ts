import { CONTENT_LENGTH_DELTA, MIN_CONTENT_LENGTH } from 'shared/constants.ts';
import type { AppState } from 'shared/types.ts';
import { getRandomString, shiftString } from 'shared/utils.ts';

/**
 * Single thread of falling code
 */
export class RendererThread {
  column: number = 0;

  row: number = 0;

  x: number = 0;

  y: number = 0;

  speed: number = 0;

  content: string = '';

  /**
   * Returns new random thread object
   * @param {AppState} state
   * @returns {RendererThread}
   */
  static createRandom(state: AppState): RendererThread {
    const thread = new this();
    thread.randomInit(state);

    return thread;
  }

  /**
   * Returns new copy of the specified thread object
   * @param {RendererThread} source
   * @returns {RendererThread}
   */
  static createCopy(source: RendererThread): RendererThread {
    const thread = new this();
    thread.copy(source);

    return thread;
  }

  /**
   * Initializes thread with random properties
   * @param {AppState} state
   */
  randomInit(state: AppState) {
    const { columnsCount, rowsCount, intro } = state;

    const contentLength = MIN_CONTENT_LENGTH + Math.round(Math.random() * CONTENT_LENGTH_DELTA);

    this.column = Math.round(Math.random() * columnsCount);
    this.row = Math.round(Math.random() * rowsCount) - (intro ? rowsCount : 0);

    this.x = this.column;
    this.y = this.row;

    this.speed = Math.ceil(Math.random() * 2) / 2; // {1.0, 2.0}

    this.content = getRandomString(contentLength);
  }

  /**
   * Copying properties from specified thread
   * @param {RendererThread} source
   */
  copy(source: RendererThread) {
    this.column = source.column;
    this.row = source.row;
    this.x = source.x;
    this.y = source.y;
    this.speed = source.speed;
    this.content = source.content;
  }

  /**
   * Creates copy of thread, updates its state according to timeDelta and returns result
   *
   * @param {AppState} state
   * @param {number} timeDelta
   * @returns {RendererThread}
   */
  calculate(state: AppState, timeDelta: number): RendererThread {
    const { content } = this;

    // Calculate thread movement
    const stepMove = (this.speed * state.speed * timeDelta);
    const targetY = this.y + stepMove;

    let result = RendererThread.createCopy(this);
    if (targetY > state.rowsCount + content.length) {
      result = RendererThread.createRandom(state);
      result.y = 0;
    } else {
      result.y = targetY;

      const shift = Math.trunc(result.y) - Math.trunc(result.row);
      result.content = shiftString(content, shift);
    }
    result.row = Math.trunc(result.y);

    return result;
  }
}
