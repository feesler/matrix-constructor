import { Button, useStore, type ButtonProps } from '@jezvejs/react';

import type { AppState } from '../../../../shared/types.ts';
import PauseIcon from './assets/pause.svg';
import PlayIcon from './assets/play.svg';

export type ToggleRunButtonProps = Partial<ButtonProps>;

export const ToggleRunButton = (props: ToggleRunButtonProps) => {
  const { getState } = useStore<AppState>();
  const state = getState();

  return (
    <Button
      {...props}
      id="toggleRunBtn"
      icon={(state.paused) ? PlayIcon : PauseIcon}
    />
  );
};
