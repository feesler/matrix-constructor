import { createContext } from 'react';
import { initialAppContext } from './initialContext.ts';
import type { AppContext } from './types.ts';

export const ApplicationContext = createContext<AppContext>(initialAppContext);
