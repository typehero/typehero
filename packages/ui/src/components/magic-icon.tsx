import { Link as LinkIcon } from 'lucide-react';
import {
  SiBluesky,
  SiGithub as Github,
  SiX as Twitter,
  SiYoutube as Youtube,
  SiLinkedin as Linkedin,
} from '@icons-pack/react-simple-icons';
import { cn } from '../cn';

export function MagicIcon({ url, className }: { url: string; className?: string }) {
  const githubRegex = /^(?:https?:\/\/)?(?:www\.)?github\.com\/([\w-]+)(\/)?$/;
  const twitterRegex = /^(?:https?:\/\/)?(?:www\.)?(?:twitter|x)\.com\/([\w-]+)(\/)?$/;
  const linkedinRegex = /^(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([\w-]+)(\/)?$/;
  const youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:@[\w-]+|channel\/[\w-]+|c\/[\w-]+)(\/)?$/;
  const blueskyRegex = /^(?:https?:\/\/)?(?:www\.)?bsky\.app\/profile\/([\w.-]+)(\/)?$/;
  const lowercaseUrl = url.toLowerCase();

  if (blueskyRegex.test(lowercaseUrl)) return <SiBluesky className={cn('h-3 w-3', className)} />;
  if (githubRegex.test(lowercaseUrl)) return <Github className={cn('h-3 w-3', className)} />;
  if (twitterRegex.test(lowercaseUrl)) return <Twitter className={cn('h-3 w-3', className)} />;
  if (linkedinRegex.test(lowercaseUrl)) return <Linkedin className={cn('h-3 w-3', className)} />;
  if (youtubeRegex.test(lowercaseUrl)) return <Youtube className={cn('h-3 w-3', className)} />;
  return <LinkIcon className={cn('h-3 w-3', className)} />;
}
