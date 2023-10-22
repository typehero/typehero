import { Github, Link as LinkIcon, Linkedin, Twitter, Youtube } from 'lucide-react';

export function MagicIcon({ url }: { url: string }) {
  const githubRegex = /^https?:\/\/(?:www\.)?github\.com\//;
  const twitterRegex = /^https?:\/\/(?:www\.)?twitter\.com\//;
  const linkedinRegex = /^https?:\/\/(?:www\.)?linkedin\.com\//;
  const youtubeRegex = /^https?:\/\/(?:www\.)?youtube\.com\//;

  const lowercaseUrl = url.toLowerCase();

  if (githubRegex.test(lowercaseUrl))
    return <Github className="h-3 w-3 text-neutral-400 dark:text-neutral-600" />;
  if (twitterRegex.test(lowercaseUrl))
    return <Twitter className="h-3 w-3 text-neutral-400 dark:text-neutral-600" />;
  if (linkedinRegex.test(lowercaseUrl))
    return <Linkedin className="h-3 w-3 text-neutral-400 dark:text-neutral-600" />;
  if (youtubeRegex.test(lowercaseUrl))
    return <Youtube className="h-3 w-3 text-neutral-400 dark:text-neutral-600" />;
  return <LinkIcon className="h-3 w-3 text-neutral-400 dark:text-neutral-600" />;
}
