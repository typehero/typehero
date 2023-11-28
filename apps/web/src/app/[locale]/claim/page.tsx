import { auth } from '@repo/auth/server';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { isBetaUser } from '~/utils/server/is-beta-user';
import { LoginButton } from '../login/_components/LoginButton';
import { isValidToken } from './_actions';
import { ClaimForm } from './claim-form';

interface Props {
  searchParams?: { token: string };
}

export default async function Claim({ searchParams }: Props) {
  const token = searchParams?.token;
  const session = await auth();

  if (session && token) {
    if (await isValidToken(session, { code: token })) {
      return redirect('/explore');
    }
  }

  const isBeta = await isBetaUser(session);
  if (isBeta) {
    return redirect('/explore');
  }

  const redirectUrl = token ? `/claim?token=${token}` : '/claim';

  const header = session ? 'In early access?' : 'Login to claim your token';
  const subheader = session ? 'Enter the token that was emailed to you' : '';
  return (
    <div className="container -mt-[56px] flex h-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 text-center sm:w-[550px]">
        <Image
          className="animate-amogup -z-10 mx-auto -mb-48"
          alt="Early Access"
          src="/Red.webp"
          height="198"
          width="150"
        />
        <div className="from-background flex flex-col space-y-3 bg-gradient-to-t from-[42%] to-transparent pt-24 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
            {header}
          </h1>
          <p>{subheader}</p>
          {session ? <ClaimForm /> : <LoginButton redirectTo={redirectUrl} />}
        </div>
      </div>
    </div>
  );
}
