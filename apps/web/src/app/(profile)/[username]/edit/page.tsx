import { notFound } from 'next/navigation';
import { EditForm } from './_components/edit-form';
import { prisma } from '@repo/db';

export default async function EditPage(props: { params: { username: string } }) {
  const [, username] = decodeURIComponent(props.params.username).split('@');
  if (username === undefined) {
    notFound();
  }
  const user = await prisma.user.findFirstOrThrow({
    where: {
      name: username,
    },
    select: {
      id: true,
      bio: true,
      userLinks: {
        orderBy: {
          url: 'desc',
        },
      },
    },
  });
  return (
    <div className="container mx-auto pt-8 lg:pt-10">
      <h1 className="text-muted-foreground text-lg">Update Profile</h1>
      <div className="mt-4">
        <EditForm className="space-y-6" user={user} />
      </div>
    </div>
  );
}
