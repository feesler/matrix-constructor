import { useStore } from '@jezvejs/react';
import { useMemo } from 'react';

import { Canvas2D } from 'components/Canvas2D/Canvas2D.tsx';
import { useAppContext } from 'context/index.ts';
import type { AppState } from 'shared/types.ts';
import { actions } from 'store/reducer.ts';

export const SceneCanvas = () => {
  const context = useAppContext();
  const { dispatch, getState } = useStore<AppState>();

  const onClick = (e: React.MouseEvent) => {
    dispatch(actions.mouseDown(e));
  };

  const state = getState();
  const canvasProps = useMemo(() => ({
    onClick,
    width: state.canvasWidth,
    height: state.canvasHeight,
    className: 'app-canvas',
  }), [state.canvasWidth, state.canvasHeight]);

  return <Canvas2D {...canvasProps} ref={context.canvas2DRef} />;
};
