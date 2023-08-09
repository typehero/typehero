import { Github, Link as LinkIcon, Linkedin, Twitter, Youtube } from 'lucide-react';

// TODO: this could be more robust
// it's not accounting for subdomains like the boomer www and stuff
export function MagicIcon({ url }: { url: string }) {
  if (url.startsWith('https://github.com/')) return <Github className="h-5 w-5 text-neutral-400" />;
  if (url.startsWith('https://twitter.com/'))
    return <Twitter className="h-5 w-5 text-neutral-400" />;
  if (url.startsWith('https://www.linkedin.com/'))
    return <Linkedin className="h-5 w-5 text-neutral-400" />;
  if (url.startsWith('https://youtube.com/'))
    return <Youtube className="h-5 w-5 text-neutral-400" />;
  return <LinkIcon className="h-5 w-5 text-neutral-400" />;
}
