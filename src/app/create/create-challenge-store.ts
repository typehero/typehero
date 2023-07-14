import type { Prisma } from '@prisma/client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CreateChallengeInputData = Pick<
  Prisma.ChallengeCreateInput,
  'name' | 'difficulty' | 'shortDescription' | 'description' | 'prompt'
>;

export type CreateChallengeState = {
  data: CreateChallengeInputData | undefined;
  setData: (data: CreateChallengeInputData) => void;
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
