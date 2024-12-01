import { notFound, permanentRedirect } from 'next/navigation';
import { getLongURL } from '../_actions/get-long-url';
import { updateClick } from '../_actions/update-click-count';

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = params;
  const url = await getLongURL(slug);

  // If the URL does not exist or has expired, return a 404
  if (!url || (url.expiresAt && url.expiresAt <= new Date())) return notFound();

  await updateClick(slug);

  return permanentRedirect(url.originalUrl);
}
