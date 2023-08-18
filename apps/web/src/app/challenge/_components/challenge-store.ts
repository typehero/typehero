import type { Difficulty } from '@repo/db/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ChallengeState {
  data:
    | {
        name: string;
        difficulty: Difficulty;
        shortDescription: string;
        description: string;
        prompt: string;
      }
    | undefined;
  setData: (data: NonNullable<ChallengeState['data']>) => void;
  clear: () => void;
}

export const useChallengeStore = create<ChallengeState>()(
  persist(
    (set, _get) => ({
      data: undefined,
      clear: () => set({ data: undefined }),
      setData: (data) => set({ data }),
    }),
    {
      name: 'create-challenge-data',
    },
  ),
);
