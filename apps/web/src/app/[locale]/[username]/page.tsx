import { Profile } from '~/components/user/profile';

interface Props {
  params: {
    username: string;
  };
}

export default function Page({ params }: Props) {
  return <Profile username={params.username} />;
}

export async function generateMetadata({ params: { username } }: Props) {
  const name = decodeURIComponent(username).substring(1);

  return {
    title: `${name}'s profile | TypeHero`,
    description: `View the profile of ${name} on TypeHero.`,
  };
}
