import { useStore } from '@jezvejs/react';
import {
  type ReactNode,
  useCallback,
  useMemo,
  useRef
} from 'react';

import type { Canvas2DRef } from 'components/Canvas2D/Canvas2D.tsx';
import type { CanvasRenderer } from 'renderer/CanvasRenderer/CanvasRenderer.ts';
import { actions } from 'store/reducer.ts';

import { type AppState } from '../shared/types.ts';
import { ApplicationContext } from './context.ts';

export interface AppContextProviderProps {
  children: ReactNode;
}

export function AppContextProvider(
  props: AppContextProviderProps,
) {
  const {
    children,
  } = props;

  const { getState, dispatch } = useStore<AppState>();

  const updateTimeout = useRef<number>(0);

  const rendererRef = useRef<CanvasRenderer | null>(null);

  const canvas2DRef = useRef<Canvas2DRef>(null);

  const getCanvasRef = () => (
    canvas2DRef
  );

  const getCanvas = useCallback(() => {
    const ref = getCanvasRef();
    return ref.current;
  }, []);

  const scheduleUpdate = useCallback(() => {
    if (updateTimeout.current) {
      clearTimeout(updateTimeout.current);
    }

    updateTimeout.current = setTimeout(() => {
      updateTimeout.current = 0;
      requestAnimationFrame(() => update());
    }, 50);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const update = () => {
    const renderer = rendererRef.current;
    if (!renderer) {
      return;
    }

    let st = getState();
    if (st.paused || st.updating) {
      return;
    }

    dispatch(actions.setUpdating(true));
    const pBefore = performance.now();

    renderer.calculate(st);

    st = getState();
    renderer.drawFrame(st);

    const perfValue = Math.round(performance.now() - pBefore);
    dispatch(actions.setPerformance(perfValue));

    if (!st.paused) {
      scheduleUpdate();
    }

    dispatch(actions.setUpdating(false));
  };

  const contextValue = useMemo(() => ({
    rendererRef,
    canvas2DRef,
    getCanvasRef,
    getCanvas,
    scheduleUpdate,
  }), [rendererRef, getCanvas, scheduleUpdate]);

  return (
    <ApplicationContext.Provider value={contextValue}>
      {children}
    </ApplicationContext.Provider>
  );
}
