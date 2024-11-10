'use client';

import type { NotificationType } from '@repo/db/types';
import { cn } from '@repo/ui/cn';
import { Markdown } from '@repo/ui/components/markdown';
import { UserAvatar } from '@repo/ui/components/user-avatar';
import { AlertCircle, AtSign, Heart, MessageCircle, ShieldAlert } from '@repo/ui/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useInView } from 'react-intersection-observer';
import { getRelativeTime } from '~/utils/relativeTime';
import type { Notification } from './notification.actions';

const BLURBS = {
  MENTION: 'mentioned you in a comment',
  LIKE: (type: string) => `liked your ${type}`,
  SYSTEM: '',
  MISC: '',
  REPLY: 'replied to you',
} satisfies Record<NotificationType, string | ((v: string) => string)>;

export function NotificationItem({
  notification,
  onSeen,
}: {
  notification: Notification;
  onSeen: (v: number) => void;
}) {
  const { ref } = useInView({
    triggerOnce: true,
    threshold: 0.8,
    onChange(inView) {
      if (notification.isRead || !inView) return;
      onSeen(notification.id);
    },
  });
  const router = useRouter();
  const getBlurb = (notification: Notification) => {
    if (notification.type === 'LIKE') {
      const type = notification.comment ? 'comment' : 'solution';
      return BLURBS.LIKE(type);
    }

    return BLURBS[notification.type];
  };

  const buildUrl = () => {
    throw new Error('the url field should be filled out');
  };
  return (
    <button
      ref={ref}
      onClick={() => router.push(notification.url || buildUrl())}
      className={cn(
        !notification.isRead ? 'bg-sky-300/20 hover:bg-sky-300/30' : 'hover:bg-muted/50',
        'border-border focus:ring-primary w-full border-b p-4 text-left outline-none transition-colors last:border-b-0 focus:outline-none',
      )}
    >
      <div className="flex items-start space-x-4">
        <UserAvatar className="h-10 w-10" src={notification.fromUser.image ?? ''} />
        <div className="flex-grow">
          <div className="flex items-center space-x-2">
            <Link
              href={`/@${notification.fromUser.name}`}
              className="focus:ring-primary relative z-10 rounded-sm text-sm font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2"
              onClick={(e) => e.stopPropagation()}
            >
              {notification.fromUser.name}
            </Link>
            <div className="flex-shrink-0">
              {notification.type === 'LIKE' && (
                <Heart className="h-4 w-4 text-red-500  dark:text-red-400" />
              )}
              {notification.type === 'MENTION' && (
                <AtSign className="h-4 w-4 text-blue-500  dark:text-blue-400" />
              )}
              {notification.type === 'REPLY' && (
                <MessageCircle className="h-4 w-4 text-purple-500  dark:text-purple-400" />
              )}
              {notification.type === 'MISC' && (
                <AlertCircle className="h-4 w-4 text-orange-500  dark:text-orange-400" />
              )}
              {notification.type === 'SYSTEM' && (
                <ShieldAlert className="h-4 w-4 text-yellow-500  dark:text-yellow-400" />
              )}
            </div>
          </div>
          <p className="text-muted-foreground text-sm">
            {notification.blurb ?? getBlurb(notification)}
          </p>
        </div>
        <div className="text-muted-foreground flex-shrink-0 text-xs">
          {' '}
          {getRelativeTime(notification.createdAt)}
        </div>
      </div>
      {notification.type === 'MENTION' ||
      notification.type === 'REPLY' ||
      notification.type === 'LIKE'
        ? // if a user edits the comment and deletes the contents just hide it
          notification.comment?.text && (
            <div className="bg-muted text-foreground ml-14 mt-1 overflow-hidden rounded-md p-3 text-sm">
              <Markdown
                disableMentions
                disableCopy
                className="m-1 max-h-[300px] overflow-y-auto rounded-md"
              >
                {notification.comment.text}
              </Markdown>
            </div>
          )
        : null}
    </button>
  );
}
