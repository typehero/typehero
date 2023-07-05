import type { Difficulty } from '@prisma/client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CreateState {
  data:
    | {
        name: string;
        difficulty: Difficulty;
        shortDescription: string;
        description: string;
        prompt: string;
      }
    | undefined;
  setData: (data: NonNullable<CreateState['data']>) => void;
  clear: () => void;
}

export const useCreateChallengeStore = create<CreateState>()(
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
