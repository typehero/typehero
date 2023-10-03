import { VercelToolbar } from '@vercel/toolbar/next';

export function Toolbar() {
  const shouldInjectToolbar = process.env.NODE_ENV === 'development';
  return shouldInjectToolbar ? <VercelToolbar /> : null;
}
