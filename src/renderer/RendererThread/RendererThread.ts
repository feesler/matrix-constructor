import { CONTENT_LENGTH_DELTA, MIN_CONTENT_LENGTH, MIN_THREADS_MARGIN } from 'shared/constants.ts';
import type { AppState } from 'shared/types.ts';
import { getRandomString, shiftString } from 'shared/utils.ts';

interface ColumnsInfo {
  filled: Record<number, RendererThread[]>;
  empty: number[];
}

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

  static getColumnsInfo(state: AppState): ColumnsInfo {
    const result: ColumnsInfo = {
      filled: {},
      empty: [],
    };

    state.threads.forEach((item) => {
      if (!result.filled[item.column]) {
        result.filled[item.column] = [];
      }

      result.filled[item.column].push(item);
    });

    for (let i = 0; i < state.columnsCount; i++) {
      if (!result.filled[i]) {
        result.empty.push(i);
      }
    }

    return result;
  }

  static getTopThread(threads: RendererThread[]): RendererThread | null {
    let result: RendererThread | null = null;

    threads.forEach((item) => {
      if (!result || result.row > item.row) {
        result = item;
      }
    });

    return result;
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
    const { filled, empty } = RendererThread.getColumnsInfo(state);

    if (empty.length > 0) {
      const emptyIndex = Math.round(Math.random() * (empty.length - 1));
      this.column = empty[emptyIndex];

      this.row = Math.round(Math.random() * rowsCount) - (intro ? rowsCount : 0) - 1;
      this.speed = Math.ceil(Math.random() * 2) / 2; // {1.0, 2.0}
    } else {
      this.column = Math.round(Math.random() * columnsCount);

      const topThread = RendererThread.getTopThread(filled[this.column] ?? []);
      if (topThread) {
        this.row = topThread.row - MIN_THREADS_MARGIN;
        this.speed = topThread.speed;
      }
    }

    this.x = this.column;
    this.y = this.row;

    const contentLength = MIN_CONTENT_LENGTH + Math.round(Math.random() * CONTENT_LENGTH_DELTA);
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

    // Create new thread if moved outside the screen
    if (targetY > state.rowsCount + content.length) {
      return RendererThread.createRandom(state);
    }

    const result = RendererThread.createCopy(this);
    result.y = targetY;

    const shift = Math.trunc(result.y) - Math.trunc(result.row);
    result.content = shiftString(content, shift);
    result.row = Math.trunc(result.y);

    return result;
  }
}
