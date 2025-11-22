import {
  Offcanvas,
  useStore,
} from '@jezvejs/react';
import {
  useCallback,
  useEffect,
  useRef,
} from 'react';

import { defaultProps } from 'app/App/initialState.ts';
import { pause, resizeBuffer, run } from 'store/actions.ts';
import { actions } from 'store/reducer.ts';

import { useAppContext } from 'context/index.ts';

import type { AppState } from 'shared/types.ts';

import { SceneCanvas } from 'components/SceneCanvas/SceneCanvas.tsx';
import { SettingsPanel } from 'components/SettingsPanel/SettingsPanel.tsx';
import { Toolbar } from 'components/Toolbar/Toolbar.tsx';

import { CanvasRenderer } from 'renderer/CanvasRenderer/CanvasRenderer.ts';
import { useFontLoad } from 'shared/hooks/use-font-load.ts';

export const MainView = () => {
  const { state, getState, dispatch } = useStore<AppState>();
  const context = useAppContext();
  const { rendererRef, getCanvas, scheduleDraw } = context;

  const fontLoaded = useFontLoad(useStore());

  const initRenderer = () => {
    dispatch(actions.initRenderer({ ...defaultProps }));
  };

  const initBufferAndRun = () => {
    dispatch(resizeBuffer(context));
    dispatch(run(context));
  };

  const start = () => {
    const st = getState();

    const canvas = getCanvas();
    if (!rendererRef || !canvas) {
      return;
    }

    const rendererProps = {
      canvas,
      canvasWidth: st.canvasWidth,
      canvasHeight: st.canvasHeight,
      columnsCount: st.columnsCount,
      rowsCount: st.rowsCount,
    };

    rendererRef.current = new CanvasRenderer(rendererProps);

    rendererRef.current?.updateFrame(st);

    if (st.autoStart) {
      initBufferAndRun();
    }
  };

  const clearRenderer = () => {
    rendererRef.current?.reset();
  };

  const resetRenderer = () => {
    const st = getState();
    const pausedBefore = st.paused;

    dispatch(pause());

    clearRenderer();

    dispatch(actions.resetRenderer());

    fitToScreen();

    initRenderer();

    requestAnimationFrame(() => {
      start();

      if (!pausedBefore) {
        initBufferAndRun();
      }
    });
  };

  const onToggleRun = () => {
    const { paused } = getState();

    if (paused) {
      initBufferAndRun();
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

  const resizeHandler = async () => {
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

    if (pausedBefore) {
      dispatch(resizeBuffer(context));
      scheduleDraw();
    } else {
      initBufferAndRun();
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

  const init = async () => {
    start();

    resetRenderer();
  };

  useEffect(() => {
    if (!fontLoaded) {
      return;
    }

    init();
  }, [fontLoaded]);

  const onClose = useCallback(() => {
    dispatch(actions.showOffcanvas(false));
  }, []);

  const fontst = getState();
  const fontReady = fontst.fontLoaded && !fontst.fontLoading;
  const loading = !fontReady;

  return (
    <div id="maincontainer" className="container">
      <main className="main-container" ref={mainRef}>
        <SceneCanvas />
      </main>

      {loading && <div className="loading">Loading...</div>}

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
