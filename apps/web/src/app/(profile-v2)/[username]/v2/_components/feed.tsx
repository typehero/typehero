import { Award, CheckCircle, MessageCircle, type LucideIcon } from '@repo/ui/icons';
import { getRelativeTime } from '~/utils/relativeTime';
import { Separator } from '@repo/ui/components/separator';
type Activity = (
  | {
      type: 'comment';
      challenge: { name: string };
    }
  | {
      type: 'badge';
      badge: { name: string };
    }
  | {
      type: 'solvedChallenge';
      challenge: { name: string };
    }
) & { date: Date };

export function generateFeedDate() {
  const activities: Array<Activity & { date: Date }> = [
    {
      type: 'comment',
      challenge: { name: 'Advanced TypeScript Generics' },
      date: new Date('2024-09-01'),
    },
    {
      type: 'badge',
      badge: { name: 'TypeScript Mastery' },
      date: new Date('2024-09-02'),
    },
    {
      type: 'solvedChallenge',
      challenge: { name: 'Type Inference Challenge' },
      date: new Date('2024-09-03'),
    },
    {
      type: 'comment',
      challenge: { name: 'Mapped Types Basics' },
      date: new Date('2024-09-04'),
    },
    {
      type: 'badge',
      badge: { name: 'TypeHero Supporter' },
      date: new Date('2024-09-05'),
    },
    {
      type: 'solvedChallenge',
      challenge: { name: 'Conditional Types Deep Dive' },
      date: new Date('2024-09-06'),
    },
  ];

  return activities;
}
export function Feed(props: { activity: Array<Activity> }) {
  return (
    <div className="flex flex-col space-y-10">
      {props.activity.map((a, index) => (
        <FeedItem key={index} activityItem={a} isLastItem={index === props.activity.length - 1} />
      ))}
    </div>
  );
}

const ACTIVITY_TO_ICON: Record<Activity['type'], LucideIcon> = {
  comment: MessageCircle,
  badge: Award,
  solvedChallenge: CheckCircle,
};

function FeedItem(props: { activityItem: Activity; isLastItem: boolean }) {
  const Icon = ACTIVITY_TO_ICON[props.activityItem.type];
  let message = '';
  if (props.activityItem.type === 'comment')
    message = `Made a comment on ${props.activityItem.challenge.name}`;
  else if (props.activityItem.type === 'badge') {
    message = `Earned the ${props.activityItem.badge.name} badge`;
  } else {
    message = `Solved the challenge ${props.activityItem.challenge.name}`;
  }

  return (
    <div className="flex flex-row space-x-3">
      <div className="relative flex flex-col items-center">
        <Icon className="h-5 w-5" />
        {!props.isLastItem ? (
          <Separator orientation="vertical" decorative className="absolute top-7" />
        ) : null}
      </div>
      <div>
        <h1>{message}</h1>
        <h2 className="text-muted-foreground text-sm tracking-tight">
          {getRelativeTime(props.activityItem.date)}
        </h2>
      </div>
    </div>
  );
}
