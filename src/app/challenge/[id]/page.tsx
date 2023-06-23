import { Challenge } from '~/components/challenge';

interface Props {
  params: {
    id: string;
  };
}

export default function Page({ params }: Props) {
  return <Challenge id={params.id} />;
}
