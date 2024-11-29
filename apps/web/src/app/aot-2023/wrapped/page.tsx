import { permanentRedirect } from 'next/navigation';

export default function Index() {
  return permanentRedirect('https://adventofts.com/');
}
