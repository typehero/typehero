import { Challenge } from '~/components/challenge';
import {} from '~/components/user/profile';

interface Props {
  params: {
    id: string;
  };
}

export default function Page({ params }: Props) {
  return <Challenge id={params.id} />;
}
