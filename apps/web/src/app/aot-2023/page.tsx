import { permanentRedirect } from 'next/navigation';

export default function AotLandingPage() {
  return permanentRedirect('https://adventofts.com/');
}
