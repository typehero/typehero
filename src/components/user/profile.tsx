import { notFound } from 'next/navigation';
import { prisma } from '~/server/db';
import Image from 'next/image';

interface Props {
  username: string;
}
export async function Profile({ username: usernameFromQuery }: Props) {
  const [, username] = decodeURIComponent(usernameFromQuery).split('@');
  const user = await prisma.user.findFirst({
    where: {
      name: {
        equals: username,
      },
    },
  });

  if (!user || !username) {
    notFound();
  }

  return (
    <>
      <h1>{user.id}</h1>
      <Image alt="user avatar" width="100" height="100" src={user.image ?? ''} />

      <p>{user.email}</p>

      <h2 className="text-xl">Raw user:</h2>
      <pre>{JSON.stringify(user, null, 4)}</pre>
      {/* <button onClick={() => handleClick(user.id)}>update user name for id: {user.id}</button> */}
    </>
  );
}
