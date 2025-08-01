import { useStore } from '@jezvejs/react';
import { useCallback } from 'react';

import { useAppContext } from 'context/index';
import { actions } from 'store/reducer.ts';
import type { AppState } from '../../shared/types.ts';

import { ReadOnlyField } from 'components/SettingsPanel/components/ReadOnlyField/ReadOnlyField.tsx';

import { RangeInputField } from './components/RangeInputField/RangeInputField.tsx';

import { resizeBuffer } from 'store/actions.ts';
import './SettingsPanel.css';

export const SettingsPanel = () => {
  const context = useAppContext();
  const { getState, dispatch } = useStore<AppState>();
  const state = getState();

  const onChangeSpeed = useCallback((value: number) => {
    dispatch(actions.setSpeed(value));
  }, []);

  const onChangeGlitchesRatio = useCallback((value: number) => {
    dispatch(actions.setGlitches(value));
    dispatch(resizeBuffer(context));
  }, []);

  const onChangeThreadsRatio = useCallback((value: number) => {
    dispatch(actions.setThreadsRatio(value));
    dispatch(resizeBuffer(context));
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

      <RangeInputField
        id="threadsInp"
        title="Threads ratio"
        min={0}
        max={10}
        step={0.01}
        value={state.threadsRatio}
        onChange={onChangeThreadsRatio}
      />

      <RangeInputField
        id="glitchesInp"
        title="Glitches ratio"
        min={0}
        max={1}
        step={0.01}
        value={state.glitchesRatio}
        onChange={onChangeGlitchesRatio}
      />

      <div className="data-footer">
      </div>
    </section>
  );
};
