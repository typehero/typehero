'use client';
import React from 'react';
import { Vote } from '../vote';
import type { ChallengeProps } from '.';
import { useSession } from '@repo/auth/react';

export function ChallengeVote({ challenge }: ChallengeProps) {
  const session = useSession();
  return (
    <Vote
      voteCount={challenge._count.vote}
      initialHasVoted={challenge.vote.length > 0}
      disabled={!session?.data?.user?.id}
      rootType="CHALLENGE"
      rootId={challenge?.id}
    />
  );
}
