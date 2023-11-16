import { Card, CardContent } from '@repo/ui/components/card';
import type { Challenges } from './card-grid';

interface Prop {
  challenge: Challenges[0] & { isRevealed: boolean };
}
export function ChallengeCard({ challenge }: Prop) {
  return (
    <Card className="dark:group-hover:border-border relative overflow-hidden duration-300 group-hover:border-neutral-400 group-hover:shadow-xl group-focus:border-neutral-500 dark:group-hover:shadow dark:group-hover:shadow-neutral-400/70">
      <CardContent className="relative z-10 flex flex-col items-center gap-5 p-8">
        <div className="text-center font-semibold capitalize tracking-wide">{challenge.name}</div>
        <div className="text-muted-foreground line-clamp-3 text-center text-sm tracking-wide">
          something goes here maybe
        </div>
        {challenge.isRevealed ? <div>REVEALED!</div> : <div>NOT REVEALED!</div>}
      </CardContent>
    </Card>
  );
}
