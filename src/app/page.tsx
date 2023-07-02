import { getServerSession } from 'next-auth';
import Head from 'next/head';
import { SignInOutButton } from '~/components/ui/sign-in-out-button';

import { authOptions } from '~/server/auth';

export default async function Index() {
  const session = await getServerSession(authOptions);
  return (
    <>
      <Head>
        <title>Typehero</title>
        <meta
          name="description"
          content="Level up your typescript skills with interactive exercises"
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <div className="mt-10 flex flex-col items-center justify-center gap-4">
        <h1 className="text-center text-6xl text-white">Typehero</h1>
        <p className="font-bold">Challenage. Learn. Excel.</p>

        <p className="mt-4 text-white">
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
          laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
          architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
          aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
          voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit
          amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut
          labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum
          exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi
          consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam
          nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
        </p>
        <div className="flex flex-col items-center justify-center gap-4">
          <SignInOutButton session={session} />
        </div>
      </div>
    </>
  );
}
