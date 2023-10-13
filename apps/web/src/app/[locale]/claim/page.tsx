import { getServerAuthSession } from '@repo/auth/server';
import { LoginButton } from '../login/_components/LoginButton';
import { ClaimForm } from './claim-form';

export default async function Claim() {
  const session = await getServerAuthSession();
  const header = session ? 'In early access?' : 'Login to claim your token';
  const subheader = session ? 'Enter the token that was emailed to you' : '';
  return (
    <div className="container flex h-full flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 text-center sm:w-[550px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
            {header}
          </h1>
          <p>{subheader}</p>
        </div>
        {session ? <ClaimForm /> : <LoginButton redirectTo="/claim" />}
      </div>
    </div>
  );
}
