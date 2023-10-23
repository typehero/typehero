import { Profile } from './_components/profile';

export default async function LayoutProfile({
  children,
  params: { username },
}: {
  children: React.ReactNode;
  params: { username: string };
}) {
  return <Profile username={username}>{children}</Profile>;
}
