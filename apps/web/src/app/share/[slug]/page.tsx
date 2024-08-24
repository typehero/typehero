import { notFound, permanentRedirect } from 'next/navigation';
import { getLongURL } from '../_actions/get-long-url';
import { updateClick } from '../_actions/update-click-count';

type Props = {
  params: {
    slug: string;
  };
};

export default async function Page({ params }: Props) {
  const { slug } = params;
  const longURL = await getLongURL(slug);

  if (!longURL) return notFound();

  await updateClick(slug);

  return permanentRedirect(longURL);
}
