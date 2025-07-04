import { CloseButton, useStore } from '@jezvejs/react';
import { useCallback } from 'react';

import { actions } from 'store/reducer.ts';

import { MenuButton } from 'components/MenuButton/MenuButton.tsx';
import { ResetButton } from 'components/ResetButton/ResetButton.tsx';
import { ToggleRunButton } from 'components/ToggleRunButton/ToggleRunButton.tsx';

import type { AppState } from '../../types.ts';
import './Toolbar.css';

export interface ToolbarProps {
  id?: string;

  onToggleRun: () => void;
  onReset: () => void;
  onClose: () => void;
  onMenu?: () => void;
};

export const Toolbar = (props: ToolbarProps) => {
  const {
    onToggleRun,
    onReset,
    onClose,
    onMenu,
    ...rest
  } = props;

  const { getState, dispatch } = useStore<AppState>();
  const state = getState();
  const showCloseBtn = !!state.settingsVisible;
  const showMenuBtn = !state.settingsVisible;

  const showOffcanvas = useCallback((settingsVisible: boolean) => {
    dispatch(actions.showOffcanvas(settingsVisible));
  }, [dispatch]);

  const onMenuBtnClick = useCallback(() => {
    showOffcanvas(true);

    onMenu?.();
  }, [showOffcanvas, onMenu]);

  return (
    <div {...rest} className="toolbar">
      <ToggleRunButton className="toolbar-btn" onClick={onToggleRun} />
      <ResetButton className="toolbar-btn" onClick={onReset} />
      {showCloseBtn && <CloseButton className="toolbar-btn" onClick={onClose} />}
      {showMenuBtn && <MenuButton className="toolbar-btn" onClick={onMenuBtnClick} />}
    </div>
  );
};
