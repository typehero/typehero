import { permanentRedirect } from 'next/navigation';

export function AotLandingPage() {
  return permanentRedirect('https://adventofts.com/');
}
