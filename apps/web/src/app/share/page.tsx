import { isAdmin } from '~/utils/auth-guards';
import { GreetUser } from './_components/greet-user';
import { URLShortnerForm } from './_components/url-shortner-form';
import { auth } from '~/server/auth';
import { notFound } from 'next/navigation';

export default async function Home() {
  const session = await auth();
  if (!isAdmin(session)) {
    return notFound();
  }
  return (
    <main className="relative flex h-screen w-screen items-center justify-center">
      <div className="relative space-y-2 p-2">
        <div className="z-10 rounded-xl border p-6 shadow">
          <h1 className="text-primary/50 rounded-2xl p-4 text-2xl font-bold md:text-5xl">
            TypeHero URL Shortner
          </h1>
          <GreetUser />
          <URLShortnerForm />
        </div>
      </div>
    </main>
  );
}
