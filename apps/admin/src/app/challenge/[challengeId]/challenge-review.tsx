'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from '@repo/auth/react';
import { useMemo } from 'react';
import { Button, DifficultyBadge, Text, useToast, UserBadge, Markdown } from '@repo/ui';
import { CodeEditor } from '@repo/monaco/code-editor';
import type { ChallengeToReview } from './page';
import { approveChallenge, denyChallenge } from './challenge-review.action';

interface Props {
  challenge: ChallengeToReview;
}
export function ChallengeReview({ challenge }: Props) {
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  const isUserACreator = useMemo(
    () => session?.user.role.includes('CREATOR') ?? false,
    [session?.user.role],
  );
  const handleApproveChallenge = async () => {
    try {
      await approveChallenge(challenge.id, challenge.userId, isUserACreator);
      toast({
        variant: 'success',
        title: 'Challenge Approved Successfully',
      });
      router.push('/admin');
    } catch {
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
      });
    }
  };

  const handleDenyChallenge = async () => {
    try {
      await denyChallenge(challenge.id);
      toast({
        variant: 'success',
        title: 'Challenge Denied Successfully',
      });
      router.push('/admin');
    } catch {
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
      });
    }
  };

  return (
    <div className="flex h-full flex-col px-4">
      <div className="mb-5">
        <Text intent="h2">{challenge.name}</Text>
        <div className="mb-3 flex gap-4">
          <DifficultyBadge difficulty={challenge.difficulty} />
          <UserBadge username={challenge.user.name} linkComponent={Link} />
        </div>
        <div className="font-semibold">Short Description</div>
        <div>{challenge.shortDescription}</div>
      </div>

      <div className="flex h-full gap-4">
        <div className="w-[500px] rounded-l-2xl rounded-r-xl border border-zinc-300 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
          <Markdown>{challenge.description}</Markdown>
        </div>
        <div className="flex-1 rounded-l-xl rounded-r-2xl border border-zinc-300 dark:border-zinc-700">
          <CodeEditor value={challenge.tests} />
        </div>
      </div>
      <div className="flex justify-end gap-3 p-4">
        <Link href="/?tab=challengeReviews">
          <Button variant="ghost">Cancel</Button>
        </Link>
        <Button onClick={handleDenyChallenge} variant="destructive">
          Deny
        </Button>
        <Button className="bg-green-300 dark:bg-green-700" onClick={handleApproveChallenge}>
          Approve
        </Button>
      </div>
    </div>
  );
}
