import type { Submission, Difficulty } from '@repo/db/types';

export interface ChallengeWithStats {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  difficulty: Difficulty;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  code: string;
  tests: string;
  status: string;
  tsconfig: unknown;
  userId: string;
  _count: {
    vote: number;
    comment: number;
    submission: number;
  };
  submission: Submission[];
  track: { name: string } | null;
  user: { name: string };
}

export interface ChallengeData {
  tag: Difficulty;
  label: string;
  challenges: ChallengeWithStats[];
  challengesLength: number;
}

export interface ChallengeExplorerClientProps {
  difficulties: readonly { readonly label: string; readonly tag: string }[];
  challengesData: ChallengeData[];
}

export interface ChallengeCardProps {
  challenge: {
    name: string;
    difficulty: Difficulty;
    _count: {
      comment: number;
      vote: number;
      submission: number;
    };
    submission: Submission[];
    user: {
      name: string;
    };
    updatedAt: Date;
    shortDescription: string;
  };
  className?: string;
}
