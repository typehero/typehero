import { Github, Link as LinkIcon, Linkedin, Twitter, Youtube } from 'lucide-react';

// TODO: this could be more robust
// it's not accounting for subdomains like the boomer www and stuff
export function MagicIcon({ url }: { url: string }) {
  const githubRegex = /^https?:\/\/(?:www\.)?github\.com\//;
  const twitterRegex = /^https?:\/\/(?:www\.)?twitter\.com\//;
  const linkedinRegex = /^https?:\/\/(?:www\.)?linkedin\.com\//;
  const youtubeRegex = /^https?:\/\/(?:www\.)?youtube\.com\//;

  if (githubRegex.test(url))
    return <Github className="h-3 w-3 text-neutral-400 dark:text-neutral-600" />;
  if (twitterRegex.test(url))
    return <Twitter className="h-3 w-3 text-neutral-400 dark:text-neutral-600" />;
  if (linkedinRegex.test(url))
    return <Linkedin className="h-3 w-3 text-neutral-400 dark:text-neutral-600" />;
  if (youtubeRegex.test(url))
    return <Youtube className="h-3 w-3 text-neutral-400 dark:text-neutral-600" />;
  return <LinkIcon className="h-3 w-3 text-neutral-400 dark:text-neutral-600" />;
}
