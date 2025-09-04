import { FRAMES_PER_SECOND } from 'shared/constants.ts';
import { AppState } from 'shared/types.ts';
import { getRandomString, shiftString } from 'shared/utils.ts';

export class RendererGlitch {
  threadIndex: number = 0;

  column: number = 0;

  row: number = 0;

  progress: number = 0;

  currentProgress: number = 0;

  speed: number = 0;

  content: string = '';

  /**
   * Returns new random glitch object
   * @param {AppState} state
   * @param {boolean} randomOffset
   * @returns {RendererGlitch}
   */
  static createRandom(state: AppState, randomOffset: boolean = true): RendererGlitch {
    const thread = new this();
    thread.randomInit(state, randomOffset);

    return thread;
  }

  /**
   * Returns new copy of the specified пдшеср object
   * @param {RendererGlitch} source
   * @returns {RendererGlitch}
   */
  static createCopy(source: RendererGlitch): RendererGlitch {
    const thread = new this();
    thread.copy(source);

    return thread;
  }

  /**
   * Initializes glitch with random properties
   * @param {AppState} state
   * @param {boolean} randomOffset
   */
  randomInit(state: AppState, randomOffset: boolean = true) {
    const { threads } = state;

    this.threadIndex = Math.round(Math.random() * (threads.length - 1));
    const thread = threads[this.threadIndex] ?? { column: 0, row: 0, content: '' };

    const glitchOffset = (randomOffset) ? Math.floor(Math.random() * thread.content.length) : 0;
    const remainingChars = thread.content.length - glitchOffset;

    this.column = thread.column;
    this.row = thread.row - glitchOffset;

    this.speed = 10 + Math.round(Math.random() * thread.speed);

    this.progress = 0;
    this.currentProgress = 0;

    const contentLength = Math.round(Math.random() * remainingChars);
    this.content = getRandomString(contentLength);
  }

  /**
   * Copying properties from specified glitch
   * @param {RendererGlitch} source
   */
  copy(source: RendererGlitch) {
    this.threadIndex = source.threadIndex;
    this.column = source.column;
    this.row = source.row;
    this.progress = source.progress;
    this.currentProgress = source.currentProgress;
    this.speed = source.speed;
    this.content = source.content;
  }

  /**
   * Creates copy of glitch, updates its state according to timeDelta and returns result
   *
   * @param {AppState} state
   * @param {number} timeDelta
   * @returns {RendererGlitch}
   */
  calculate(state: AppState, timeDelta: number): RendererGlitch {
    const { threads } = state;

    let result = RendererGlitch.createCopy(this);

    if (!threads[result.threadIndex]) {
      result.threadIndex = Math.round(Math.random() * (threads.length - 1));
    }

    const thread = threads[result.threadIndex];

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
      result = RendererGlitch.createRandom(state, false);
    }

    return result;
  }
}
