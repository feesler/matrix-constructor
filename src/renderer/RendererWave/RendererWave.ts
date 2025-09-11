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

  size: number;

  speed: number;

  /**
   * Returns new copy of the specified wave effect object
   * @param {RendererWave} source
   * @returns {RendererWave}
   */
  static createCopy(source: RendererWave): RendererWave {
    const thread = new this(source.leftColumn, source.topRow, source.width);
    thread.copy(source);

    return thread;
  }

  constructor(column: number, row: number, width: number) {
    this.leftColumn = column;
    this.rightColumn = column;
    this.topRow = row;
    this.bottomRow = row;
    this.x = this.leftColumn;
    this.y = this.topRow;
    this.width = width;
    this.size = 0;
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
    this.size = source.size;
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
      || this.rightColumn < rowsCount
      || this.topRow + this.width >= 0
      || this.bottomRow < columnsCount
    );

    if (!isEffectVisible) {
      return null;
    }

    const result = RendererWave.createCopy(this);
    const step = timeDelta * this.speed;

    result.y -= step;
    result.x -= step;
    result.size += step * 2;
    result.leftColumn = Math.round(result.x);
    result.rightColumn = Math.round(result.x + result.size);
    result.topRow = Math.round(result.y);
    result.bottomRow = Math.round(result.y + result.size);

    return result;
  }
}
