import { useStore } from '@jezvejs/react';
import { useCallback } from 'react';

import { useAppContext } from 'context/index';
import type { AppState } from '../../types.ts';
import { actions } from 'store/reducer.ts';

import { ReadOnlyField } from 'components/ReadOnlyField/ReadOnlyField.tsx';

import { RangeInputField } from './components/RangeInputField/RangeInputField.tsx';

import './SettingsPanel.css';

export const SettingsPanel = () => {
  const context = useAppContext();
  const { getState, dispatch } = useStore<AppState>();
  const state = getState();

  const onChangeSpeed = useCallback((value: number) => {
    dispatch(actions.setSpeed(value));
  }, []);

  const { threads } = context?.rendererRef?.current?.props ?? {};

  return (
    <section className="data-section">

      <ReadOnlyField
        id="threadscount"
        title="Threads"
        value={threads?.length ?? 0}
      />
      <ReadOnlyField
        id="perfvalue"
        title="Performance"
        value={state.perfValue}
      />

      <RangeInputField
        id="speedInp"
        title="Speed"
        min={0}
        max={1000}
        step={1}
        value={state.speed}
        onChange={onChangeSpeed}
      />

      <div className="data-footer">
      </div>
    </section>
  );
};
