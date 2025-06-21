import { useStore } from '@jezvejs/react';

import { useAppContext } from 'context/index';
import { ReadOnlyField } from 'components/ReadOnlyField/ReadOnlyField.tsx';

import type { AppState } from '../../types.ts';
import './SettingsPanel.css';

export const SettingsPanel = () => {
  const context = useAppContext();
  const { getState } = useStore<AppState>();
  const state = getState();

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

      <div className="data-footer">
      </div>
    </section>
  );
};
