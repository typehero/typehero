import clsx from 'clsx';
import { Link as LinkIcon } from 'lucide-react';
import * as AllLucideIcons from 'lucide-react';

interface IconKey {
  key: string;
  icon: keyof typeof AllLucideIcons;
}

const UrlMap: IconKey[] = [
  {
    key: 'github.com',
    icon: 'Github',
  },
  {
    key: 'twitter.com',
    icon: 'Twitter',
  },
  {
    key: 'linkedin.com',
    icon: 'Linkedin',
  },
  {
    key: 'youtube.com',
    icon: 'Youtube',
  },
];

export function MagicIcon({
  url,
  size = 18,
  className,
}: {
  url: string;
  size?: number;
  className?: string;
}) {
  for (const entry of UrlMap) {
    if (url.includes(entry.key)) {
      const Icon = AllLucideIcons[entry.icon] as AllLucideIcons.LucideIcon;
      return (
        <Icon size={size} className={clsx('text-neutral-400 dark:text-neutral-600', className)} />
      );
    }
  }
  return (
    <LinkIcon size={size} className={clsx('text-neutral-400 dark:text-neutral-600', className)} />
  );
}
