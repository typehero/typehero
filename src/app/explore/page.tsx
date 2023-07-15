import { Explore } from '~/components/explore';

// CI fails without this
export const dynamic = 'force-dynamic';
export default function Page() {
  return <Explore />;
}
