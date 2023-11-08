import { notFound } from 'next/navigation';
import NotFound from '../not-found';

export default function CatchAllPage() {
  return <NotFound />;
}
