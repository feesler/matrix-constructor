import { useStore } from '@jezvejs/react';
import { useMemo } from 'react';

import { useAppContext } from 'context/index';

import { Canvas2D } from 'components/Canvas2D/Canvas2D.tsx';

import type { AppState } from '../../shared/types.ts';

export const SceneCanvas = () => {
  const context = useAppContext();
  const { getState } = useStore<AppState>();
  const state = getState();

  const canvasProps = useMemo(() => ({
    width: state.canvasWidth,
    height: state.canvasHeight,
    className: 'app-canvas',
  }), [state.canvasWidth, state.canvasHeight]);

  return <Canvas2D {...canvasProps} ref={context.canvas2DRef} />;
};
