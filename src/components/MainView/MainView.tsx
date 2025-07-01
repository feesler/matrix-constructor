import {
  Offcanvas,
  useStore
} from '@jezvejs/react';
import {
  useCallback,
  useEffect,
  useRef,
} from 'react';

import { pause, run } from 'store/actions.ts';
import { actions } from 'store/reducer.ts';

import { useAppContext } from 'context/index';

import { SceneCanvas } from 'components/SceneCanvas/SceneCanvas.tsx';
import { SettingsPanel } from 'components/SettingsPanel/SettingsPanel.tsx';
import { Toolbar } from 'components/Toolbar/Toolbar.tsx';

import { CanvasRenderer } from 'renderer/CanvasRenderer/CanvasRenderer.ts';

import { getRandomThread, getScreenArea } from 'utils/index.ts';

import { MAX_CONTENT_LENGTH, SCREEN_AREA_TO_CONTENT_RATIO } from '../../constants.ts';
import type { AppState } from '../../types.ts';
import { defaultProps } from './initialState.ts';

export const MainView = () => {
  const { state, getState, dispatch } = useStore<AppState>();
  const context = useAppContext();
  const { rendererRef, getCanvas } = context;

  const initRenderer = () => {
    dispatch(actions.initRenderer({ ...defaultProps }));
  };

  const start = () => {
    const st = getState();

    const canvas = getCanvas();
    if (!rendererRef || !canvas) {
      return;
    }

    const rendererProps = {
      canvas,
      threads: [],
      canvasWidth: st.canvasWidth,
      canvasHeight: st.canvasHeight,
    };

    rendererRef.current = new CanvasRenderer(rendererProps);

    rendererRef.current?.drawFrame();

    if (st.autoStart) {
      dispatch(run(context));
    }
  };

  const clearRenderer = () => {
    rendererRef.current?.reset();
  };

  const resetRenderer = () => {
    dispatch(pause());

    clearRenderer();

    dispatch(actions.resetRenderer());

    fitToScreen();

    initRenderer();

    requestAnimationFrame(() => {
      start();
    });
  };

  const onToggleRun = () => {
    if (state.paused) {
      dispatch(run(context));
    } else {
      dispatch(pause());
    }
  };

  const onReset = () => {
    resetRenderer();
  };

  const mainRef = useRef<HTMLElement | null>(null);

  /**
   * Changes zoom to fit the entire scene on the screen
   */
  const fitToScreen = () => {
    const st = getState();
    const canvasSize = Math.min(st.canvasWidth, st.canvasHeight);

    const notResized = canvasSize === 0;
    dispatch(actions.requestFitToScreen(notResized));
  };

  const resizeHandler = () => {
    const st = getState();
    const rect = mainRef.current?.getBoundingClientRect() ?? null;
    if (!rect) {
      return;
    }

    const canvasWidth = rect.width;
    let canvasHeight = rect.height;
    if (
      canvasWidth === 0
      || canvasHeight === 0
      || (st.canvasWidth === canvasWidth && st.canvasHeight === canvasHeight)
    ) {
      return;
    }

    const pausedBefore = st.paused;
    dispatch(pause());

    if (canvasHeight > 0) {
      canvasHeight -= 1;
    }

    dispatch(actions.setCanvasSize({ canvasWidth, canvasHeight }));

    if (st.fitToScreenRequested) {
      fitToScreen();
    }

    const canvas = getCanvas();
    if (!rendererRef || !canvas) {
      return;
    }

    const screenArea = getScreenArea({ canvasWidth, canvasHeight });
    const threadsCount = Math.round((screenArea / MAX_CONTENT_LENGTH) * SCREEN_AREA_TO_CONTENT_RATIO);

    const rendererProps = {
      canvas,
      threads: Array(threadsCount).fill(0).map(() => getRandomThread({ canvasWidth, canvasHeight })),
      canvasWidth,
      canvasHeight,
    };

    rendererRef.current = new CanvasRenderer(rendererProps);

    setTimeout(() => {
      rendererRef?.current?.drawFrame();
    }, 10);

    if (!pausedBefore) {
      dispatch(run(context));
    }
  };

  // ResizeObserver
  useEffect(() => {
    if (!mainRef.current) {
      return undefined;
    }

    const observer = new ResizeObserver(resizeHandler);
    observer.observe(mainRef.current);

    return () => {
      observer.disconnect();
    };
  }, [mainRef.current]);

  useEffect(() => {
    start();

    resetRenderer();
  }, []);

  const onClose = useCallback(() => {
    dispatch(actions.showOffcanvas(false));
  }, []);

  return (
    <div id="maincontainer" className="container">
      <main className="main-container" ref={mainRef}>
        <SceneCanvas />
      </main>

      <Toolbar onToggleRun={onToggleRun} onReset={onReset} onClose={onClose} />

      <Offcanvas
        className="settings"
        placement="right"
        closed={!state.settingsVisible}
        onClosed={onClose}
        usePortal={false}
      >
        <SettingsPanel />
      </Offcanvas>
    </div>
  );
};
