import { notFound } from 'next/navigation';
import { prisma } from '~/server/db';
import DashboardPage from '../dashboard/DashboardPage';

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

  return <DashboardPage />;
}
