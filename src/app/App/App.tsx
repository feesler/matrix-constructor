import { StoreProvider } from '@jezvejs/react';

import { MainView } from '../../components/MainView/MainView.tsx';
import { getInitialState } from './initialState.ts';
import { AppContextProvider } from '../../context/AppContextProvider.tsx';

import { reducer } from '../../store/reducer.ts';

import type { AppState } from '../../shared/types.ts';

import './App.css';

function App() {
  const initialState = getInitialState();

  return (
    <StoreProvider<AppState>
      reducer={reducer}
      initialState={initialState}
    >
      <AppContextProvider>
        <MainView />
      </AppContextProvider>
    </StoreProvider>
  );
}

export default App;
