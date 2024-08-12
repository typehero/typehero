import { isAdmin } from '~/utils/isAdmin';
import { GreetUser } from './_components/greet-user';
import { URLShortnerForm } from './_components/url-shortner-form';
import { auth } from '~/server/auth';
import { permanentRedirect } from 'next/navigation';

export default async function Home() {
  const session = await auth();
  if (!isAdmin(session)) {
    permanentRedirect(`${process.env.NEXT_PUBLIC_URL || 'localhost:3000'}`);
  }
  return (
    <main className="relative flex h-screen w-screen items-center justify-center">
      <div className="relative space-y-2">
        <div className="z-10 rounded-xl border border-slate-400 p-6 dark:border-slate-800">
          <h1 className="rounded-2xl p-4 text-5xl font-bold">TypeHero URL Shortner</h1>
          <GreetUser />
          <URLShortnerForm />
        </div>
      </div>
    </main>
  );
}
