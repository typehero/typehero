import Link from 'next/link';
import { LoginButton } from './_components/LoginButton';

export default async function Index({
  searchParams,
}: {
  searchParams: {
    redirectTo: string | null;
  };
}) {
  return (
    <div className="-mt-[56px] container flex h-screen flex-col items-center justify-center">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 text-center sm:w-[450px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="font-bold text-4xl text-neutral-900 tracking-tight dark:text-white">
              Welcome to Public Beta!
            </h1>
            <p className="text-muted-foreground text-sm">
              Start your typescript journey by logging in below.
            </p>
          </div>
          <LoginButton redirectTo={searchParams.redirectTo ?? '/explore'} />
          <p className="mx-auto px-8 text-muted-foreground text-sm sm:w-[350px]">
            By clicking Login, you agree to our <br />
            <Link href="/tos" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
