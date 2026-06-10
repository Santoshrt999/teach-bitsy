import { create } from 'zustand';
import type { Screen } from '../types';

interface AppState {
  /** Which stepper tab is active. */
  screen: Screen;
  setScreen: (screen: Screen) => void;

  /** "Grown-up mode" surfaces the real ML terminology (loss, learning rate, …). */
  grownUpMode: boolean;
  toggleGrownUpMode: () => void;
}

/**
 * Global app state. Phase 1 holds only navigation + grown-up mode; the dataset,
 * model status and predictions are added in later phases.
 */
export const useStore = create<AppState>((set) => ({
  screen: 'collect',
  setScreen: (screen) => set({ screen }),

  grownUpMode: false,
  toggleGrownUpMode: () => set((s) => ({ grownUpMode: !s.grownUpMode })),
}));
