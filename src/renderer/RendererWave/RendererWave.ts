import { WAVE_EFFECT_SPEED } from 'shared/constants.ts';
import { AppState } from 'shared/types.ts';

export class RendererWave {
  leftColumn: number;

  rightColumn: number;

  topRow: number;

  bottomRow: number;

  x: number;

  y: number;

  width: number;

  height: number;

  horizontalSize: number;

  verticalSize: number;

  speed: number;

  /**
   * Returns new copy of the specified wave effect object
   * @param {RendererWave} source
   * @returns {RendererWave}
   */
  static createCopy(source: RendererWave): RendererWave {
    const thread = new this(source.leftColumn, source.topRow, source.width, source.height);
    thread.copy(source);

    return thread;
  }

  constructor(column: number, row: number, width: number, height: number) {
    this.leftColumn = column;
    this.rightColumn = column;
    this.topRow = row;
    this.bottomRow = row;
    this.x = this.leftColumn;
    this.y = this.topRow;
    this.width = width;
    this.height = height;
    this.horizontalSize = 0;
    this.verticalSize = 0;
    this.speed = WAVE_EFFECT_SPEED;
  }

  /**
   * Copying properties from specified wave
   * @param {RendererWave} source
   */
  copy(source: RendererWave) {
    this.leftColumn = source.leftColumn;
    this.rightColumn = source.rightColumn;
    this.topRow = source.topRow;
    this.bottomRow = source.bottomRow;
    this.x = source.x;
    this.y = source.y;
    this.width = source.width;
    this.height = source.height;
    this.horizontalSize = source.horizontalSize;
    this.verticalSize = source.verticalSize;
  }

  /**
   * Creates copy of wave effect, updates its state according to timeDelta and returns result
   *
   * @param {AppState} state
   * @param {number} timeDelta
   * @returns {RendererWave | null}
   */
  calculate(state: AppState, timeDelta: number): RendererWave | null {
    const { columnsCount, rowsCount } = state;

    const isEffectVisible = (
      this.leftColumn + this.width >= 0
      || this.rightColumn < columnsCount
      || this.topRow + this.height >= 0
      || this.bottomRow < rowsCount
    );

    if (!isEffectVisible) {
      return null;
    }

    const result = RendererWave.createCopy(this);
    const step = timeDelta * this.speed;

    const charAspectRatio = state.charWidth / state.charHeight;
    const horizontalStep = step;
    const verticalStep = step * charAspectRatio;

    result.y -= verticalStep;
    result.x -= horizontalStep;
    result.horizontalSize += horizontalStep * 2;
    result.verticalSize += verticalStep * 2;
    result.leftColumn = Math.round(result.x);
    result.rightColumn = Math.round(result.x + result.horizontalSize);
    result.topRow = Math.round(result.y);
    result.bottomRow = Math.round(result.y + result.verticalSize);

    return result;
  }
}
