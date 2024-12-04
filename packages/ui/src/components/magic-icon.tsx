// TODO: Handle the deprecation
// > `Github` is deprecated. Brand icons have been deprecated and are due to be removed, please refer to https://github.com/lucide-icons/lucide/issues/670.
// > We recommend using https://simpleicons.org/?q=github instead.
// > This icon will be removed in v1.0
/* eslint-disable @typescript-eslint/no-deprecated */
import { Github, Link as LinkIcon, Linkedin, Twitter, Youtube } from 'lucide-react';
import { cn } from '../cn';

export function MagicIcon({ url, className }: { url: string; className?: string }) {
  const githubRegex = /^(?:https?:\/\/)?(?:www\.)?github\.com\/(?:\w+)(\/)?$/;
  const twitterRegex = /^(?:https?:\/\/)?(?:www\.)?twitter\.com\/(?:\w+)(\/)?$/;
  const linkedinRegex = /^(?:https?:\/\/)?(?:www\.)?linkedin\.com\/(?:\w+)(\/)?$/;
  const youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:\w+)(\/)?$/;

  const lowercaseUrl = url.toLowerCase();

  if (githubRegex.test(lowercaseUrl)) return <Github className={cn('h-3 w-3', className)} />;
  if (twitterRegex.test(lowercaseUrl)) return <Twitter className={cn('h-3 w-3', className)} />;
  if (linkedinRegex.test(lowercaseUrl)) return <Linkedin className={cn('h-3 w-3', className)} />;
  if (youtubeRegex.test(lowercaseUrl)) return <Youtube className={cn('h-3 w-3', className)} />;
  return <LinkIcon className={cn('h-3 w-3', className)} />;
}
