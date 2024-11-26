import { permanentRedirect } from 'next/navigation';

export async function AotLandingPage() {
  return permanentRedirect('https://adventofts.com/');
}
