import { Github, Link as LinkIcon, Linkedin, Twitter, Youtube } from 'lucide-react';
import { cn } from '../cn';

export function MagicIcon({ url, className }: { url: string; className?: string }) {
  const githubRegex = /^(?:https?:\/\/)?(?:www\.)?github\.com\/(?:\w+)(\/)?$/;
  const twitterRegex = /^(?:https?:\/\/)?(?:www\.)?twitter\.com\/(?:\w+)(\/)?$/;
  const linkedinRegex = /^(?:https?:\/\/)?(?:www\.)?linkedin\.com\/(?:\w+)(\/)?$/;
  const youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:\w+)(\/)?$/;

  const lowercaseUrl = url.toLowerCase();

  if (githubRegex.test(lowercaseUrl))
    return <Github className={cn('h-3 w-3 text-neutral-400 dark:text-neutral-600', className)} />;
  if (twitterRegex.test(lowercaseUrl))
    return <Twitter className={cn('h-3 w-3 text-neutral-400 dark:text-neutral-600', className)} />;
  if (linkedinRegex.test(lowercaseUrl))
    return <Linkedin className={cn('h-3 w-3 text-neutral-400 dark:text-neutral-600', className)} />;
  if (youtubeRegex.test(lowercaseUrl))
    return <Youtube className={cn('h-3 w-3 text-neutral-400 dark:text-neutral-600', className)} />;
  return <LinkIcon className={cn('h-3 w-3 text-neutral-400 dark:text-neutral-600', className)} />;
}
