import type { Prisma } from '@prisma/client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CreateChallengeState = {
  data:
    | Pick<
        Prisma.ChallengeCreateInput,
        'name' | 'difficulty' | 'shortDescription' | 'description' | 'prompt'
      >
    | undefined;
  setData: (data: NonNullable<CreateChallengeState['data']>) => void;
  clear: () => void;
};

export const useCreateChallengeStore = create<CreateChallengeState>()(
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
