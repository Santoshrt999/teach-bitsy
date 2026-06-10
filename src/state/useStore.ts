import { create } from 'zustand';
import type { Screen } from '../types';

/** One of the two class labels the child trains. Name is editable; id is stable. */
export interface Bucket {
  id: string;
  name: string;
}

/** A single training example: a square image (data URL) tagged to a bucket. */
export interface Example {
  id: string;
  bucketId: string;
  src: string;
  createdAt: number;
}

const DEFAULT_BUCKETS: Bucket[] = [
  { id: 'a', name: 'Cats' },
  { id: 'b', name: 'Dogs' },
];

interface AppState {
  /** Which stepper tab is active. */
  screen: Screen;
  setScreen: (screen: Screen) => void;

  /** "Grown-up mode" surfaces the real ML terminology (loss, learning rate, …). */
  grownUpMode: boolean;
  toggleGrownUpMode: () => void;

  /** The two class buckets and their training examples. */
  buckets: Bucket[];
  examples: Example[];
  renameBucket: (bucketId: string, name: string) => void;
  addExample: (bucketId: string, src: string) => void;
  removeExample: (exampleId: string) => void;
  /** Wipe all collected examples (keeps bucket names). */
  resetDataset: () => void;
}

/**
 * Global app state. Holds navigation, grown-up mode, and the dataset (buckets +
 * examples). Model status and predictions are added in Phase 3.
 */
export const useStore = create<AppState>((set) => ({
  screen: 'collect',
  setScreen: (screen) => set({ screen }),

  grownUpMode: false,
  toggleGrownUpMode: () => set((s) => ({ grownUpMode: !s.grownUpMode })),

  buckets: DEFAULT_BUCKETS,
  examples: [],

  renameBucket: (bucketId, name) =>
    set((s) => ({
      buckets: s.buckets.map((b) => (b.id === bucketId ? { ...b, name } : b)),
    })),

  addExample: (bucketId, src) =>
    set((s) => ({
      examples: [
        ...s.examples,
        { id: crypto.randomUUID(), bucketId, src, createdAt: Date.now() },
      ],
    })),

  removeExample: (exampleId) =>
    set((s) => ({ examples: s.examples.filter((e) => e.id !== exampleId) })),

  resetDataset: () => set({ examples: [] }),
}));

/** Count of examples in a bucket. */
export const countInBucket = (examples: Example[], bucketId: string): number =>
  examples.reduce((n, e) => (e.bucketId === bucketId ? n + 1 : n), 0);
