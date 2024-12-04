import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const DEFAULT_VALUES = {
  prompt: '### Description',
  challenge: {
    id: 1,
    code: 'type Foo = string;',
    slug: 'some-slug',
    tests: '// test cases go here',
  },
};

type Values = typeof DEFAULT_VALUES;

interface ChallengePlaygroundState {
  values: Values;
  updateValues: (values: Values) => void;
}

export const useChallengePlaygroundStore = create<ChallengePlaygroundState>()(
  persist(
    (set, get) => ({
      values: DEFAULT_VALUES,
      updateValues: (values) => set({ values: { ...get().values, ...values } }),
    }),
    {
      name: 'challenge-playground',
    },
  ),
);
