import { useContext } from 'react';
import { ApplicationContext } from './context.ts';
import type { AppContext } from './types.ts';

export function useAppContext(): AppContext {
  return useContext(ApplicationContext);
}
