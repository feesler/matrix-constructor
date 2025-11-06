import { useStore } from '@jezvejs/react';
import {
  type ReactNode,
  useCallback,
  useMemo,
  useRef,
} from 'react';

import type { Canvas2DRef } from 'components/Canvas2D/Canvas2D.tsx';
import type { CanvasRenderer } from 'renderer/CanvasRenderer/CanvasRenderer.ts';
import { type AppState } from 'shared/types.ts';
import { actions } from 'store/reducer.ts';

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

  const previousFrameTimestamp = useRef<number>(0);
  const drawTimeout = useRef<number>(0);
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

  const scheduleDraw = useCallback(() => {
    if (drawTimeout.current) {
      return;
    }

    drawTimeout.current = setTimeout(() => {
      requestAnimationFrame(() => {
        draw();
        drawTimeout.current = 0;
      });
    }, 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const draw = () => {
    const renderer = rendererRef.current;
    if (!renderer) {
      return;
    }

    const st = getState();

    renderer.writeStateToBuffer(st);
    renderer.drawFrame(st);
  };

  const scheduleUpdate = useCallback(() => {
    if (updateTimeout.current) {
      return;
    }

    updateTimeout.current = setTimeout(() => {
      previousFrameTimestamp.current = 0;
      requestAnimationFrame((time) => {
        update(time);
        updateTimeout.current = 0;
      });
    }, 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (time: number) => {
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

    const curTime = time * 0.001;
    const prevTime = previousFrameTimestamp.current;
    const timeDelta = (prevTime !== 0) ? (curTime - prevTime) : 0;
    previousFrameTimestamp.current = curTime;

    st = renderer.calculate(st, timeDelta);

    dispatch(actions.setThreads(st.threads));
    dispatch(actions.setGlitches(st.glitches));
    dispatch(actions.setWaveEffect(st.waveEffect));

    st = getState();
    renderer.updateFrame(st);

    const perfValue = Math.round(performance.now() - pBefore);
    dispatch(actions.setPerformance(perfValue));

    if (!st.paused) {
      requestAnimationFrame(update);
    }

    dispatch(actions.setUpdating(false));
  };

  const contextValue = useMemo(() => ({
    rendererRef,
    canvas2DRef,
    getCanvasRef,
    getCanvas,
    scheduleUpdate,
    scheduleDraw,
  }), [rendererRef, getCanvas, scheduleUpdate, scheduleDraw]);

  return (
    <ApplicationContext.Provider value={contextValue}>
      {children}
    </ApplicationContext.Provider>
  );
}
