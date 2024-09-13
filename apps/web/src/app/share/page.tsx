import { isAdmin } from '~/utils/auth-guards';
import { GreetUser } from './_components/greet-user';
import { URLShortenerForm } from './_components/url-shortener-form';
import { auth } from '~/server/auth';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'URL Shortener | TypeHero - Admin',
  description: '.',
};

export default async function Home() {
  const session = await auth();
  if (!isAdmin(session)) {
    return notFound();
  }
  return (
    <main className="relative flex w-screen items-center justify-center">
      <div className="w-full max-w-xl rounded-xl border p-6 shadow">
        <h1 className="text-primary rounded-2xl p-1 text-center text-lg font-bold md:text-xl">
          TypeHero URL Shortener
        </h1>
        <GreetUser />
        <URLShortenerForm />
      </div>
    </main>
  );
}
