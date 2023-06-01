import { createServerSideHelpers } from '@trpc/react-query/server';
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';
import type { GetServerSidePropsContext } from 'next';
import superjson from 'superjson';
import { appRouter } from '~/server/api/root';
import { createTRPCContext } from '~/server/api/trpc';

export async function getServerSideProps(context: GetServerSidePropsContext<{ username: string }>) {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: await createTRPCContext({ req: context.req as any, res: context.res as any }),
    transformer: superjson,
  });

  const usernameFromQuery = context.query.username as string;

  if (!usernameFromQuery.startsWith('@')) {
    return {
      notFound: true,
    };
  }

  const [, username] = usernameFromQuery.split('@');

  const user = await ssg.user.byName.fetch({
    name: username!,
  });

  if (!user || !username) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
}

export { UserPage as default } from '~/components/user/username';
