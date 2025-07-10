import { type StoreActionAPI, type StoreActionFunction } from '@jezvejs/react';

import { type AppContext } from 'context/index';

import { type AppState } from 'shared/types.ts';
import { actions } from './reducer.ts';

export interface MainViewActionsAPI {
  scheduleUpdate: () => void;
  processRotation: (a: number, b: number, g: number) => void;
};

export const pause = (): StoreActionFunction<AppState> => ({ getState, dispatch }) => {
  const st = getState();
  if (st.paused) {
    return;
  }

  dispatch(actions.pause());
};

export const run = ({ scheduleUpdate }: AppContext) => ({
  getState,
  dispatch,
}: StoreActionAPI<AppState>) => {
  const st = getState();
  if (!st.paused) {
    return;
  }

  dispatch(actions.run());
  scheduleUpdate?.();
};

