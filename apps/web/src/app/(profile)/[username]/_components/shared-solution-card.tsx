import { Card, CardHeader, CardTitle } from '@repo/ui/components/card';
import { MessageCircle, ThumbsUp } from '@repo/ui/icons';

import type { Difficulty } from '@repo/db/types';
import {
  SHADOWS_BY_DIFFICULTY,
  BORDERS_BY_DIFFICULTY,
  ChallengeDifficultyIcon,
} from '~/app/explore/_components/explore-card';
import { Badge } from '@repo/ui/components/badge';

export interface SharedSolutionCardProps {
  solution: {
    commentCount: number;
    voteCount: number;
    isPinned: boolean;
    challenge: { difficulty: Difficulty; name: string };
  };
}
export function SharedSolutionCard(props: SharedSolutionCardProps) {
  return (
    <Card
      className={`group/card bg-background hover:bg-card-hovered xl:min-w-[333px]} relative overflow-hidden duration-300 sm:min-w-[300px]
      ${SHADOWS_BY_DIFFICULTY[props.solution.challenge.difficulty]}
      ${BORDERS_BY_DIFFICULTY[props.solution.challenge.difficulty]}
      `}
    >
      <ChallengeDifficultyIcon difficulty={props.solution.challenge.difficulty} />
      <CardHeader className="relative flex flex-col items-start gap-1 py-5">
        <CardTitle className="max-w-[75%] truncate text-lg duration-300 lg:text-2xl">
          {props.solution.challenge.name}
        </CardTitle>
        <div className="flex items-center gap-5 text-center duration-300">
          {props.solution.isPinned ? <Badge>Pinned</Badge> : null}
          <div className="flex items-center gap-2 text-sm">
            <MessageCircle size={18} />
            {props.solution.commentCount}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <ThumbsUp size={18} />
            {props.solution.voteCount}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
