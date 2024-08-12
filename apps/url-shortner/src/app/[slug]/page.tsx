import { permanentRedirect } from 'next/navigation';
import { getLongURL } from '~/actions/get-long-url';
import { updateClickCount } from '~/actions/update-click-count';

type Props = {
  params: {
    slug: string;
  };
};

export default async function Page({ params }: Props) {
  const { slug } = params;

  const longURL = await getLongURL(slug);
  if (!longURL)
    return permanentRedirect(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/404`);

  await updateClickCount(slug);

  return permanentRedirect(longURL);
}
