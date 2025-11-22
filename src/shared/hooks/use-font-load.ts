import { StoreProviderContext } from '@jezvejs/react';
import { useEffect } from 'react';
import { AppState } from 'shared/types.ts';
import { actions } from 'store/reducer.ts';

export function useFontLoad(context: StoreProviderContext<AppState>) {
  const { getState, dispatch } = context;

  const waitForFontLoad = async () => (
    new Promise((resolve) => {
      const checkState = () => {
        const st = getState();

        if (st.fontLoaded) {
          resolve(true);
        } else {
          setTimeout(checkState, 50);
        }
      };

      checkState();
    })
  );

  useEffect(() => {
    const loadFont = async () => {
      const st = getState();
      if (st.fontLoaded || st.fontLoading) {
        return;
      }

      dispatch(actions.setFontLoading(true));

      const font = new FontFace('code', 'url("assets/code.woff")');
      await font.load();
      document.fonts.add(font);

      dispatch(actions.setFontLoading(false));
      dispatch(actions.setFontLoaded());

      await waitForFontLoad();
    };

    loadFont();
  }, []);

  const st = getState();

  return st.fontLoaded;
}
