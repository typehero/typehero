'use client';

import type { Challenge, Vote } from '@prisma/client';
import { debounce } from 'lodash';
import { useSession } from 'next-auth/react';
import ReactMarkdown from 'react-markdown';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { incrementOrDecrementUpvote } from './increment.action';
import { useRef, useState } from 'react';
import { ArrowBigUp } from 'lucide-react';
import { clsx } from 'clsx';

interface Props {
  challenge: Challenge & {
    Vote: Vote[];
    _count: {
      Vote: number;
    };
  };
}
export function DescriptionPanel({ challenge }: Props) {
  const [votes, setVotes] = useState(challenge._count.Vote);
  const [hasVoted, setHasVoted] = useState(challenge.Vote.length > 0);
  const session = useSession();
  const debouncedSearch = useRef(
    debounce(async (challengeId: number, userId: string, shouldIncrement: boolean) => {
      const votes = await incrementOrDecrementUpvote(challengeId, userId, shouldIncrement);
      if (votes !== undefined && votes !== null) {
        setVotes(votes);
      }
    }, 500),
  ).current;
  return (
    <div className="flex-1 rounded-md bg-white dark:bg-zinc-800">
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="solutions">Solutions</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-0">
          <div className="flex">
            <div className="p-t-[2px] flex w-[30px] items-start justify-center">
              {session?.data?.user?.id && (
                <button
                  className=""
                  onClick={async () => {
                    let shouldIncrement: boolean;
                    if (hasVoted) {
                      setVotes((v) => v - 1);
                      shouldIncrement = false;
                      setHasVoted(false);
                    } else {
                      setVotes((v) => v + 1);
                      shouldIncrement = true;
                      setHasVoted(true);
                    }
                    debouncedSearch(challenge.id, session?.data?.user?.id, shouldIncrement);
                  }}
                >
                  <ArrowBigUp className={clsx({ 'fill-red-500': hasVoted })} />
                  {votes}
                </button>
              )}
            </div>
            <div className="prose-invert prose-h3:text-xl">
              <ReactMarkdown>{challenge.description}</ReactMarkdown>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="solutions">
          <div className="p-4">solu</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
