'use client';

import { signIn } from '@repo/auth/react';
import { Button } from '@repo/ui/components/button';
import { useState } from 'react';
import { claimBetaToken } from '../_actions';
import type { Token } from '../page';

type State = 'error' | 'idle' | 'pending' | 'success';
interface Props {
  token: Token | null;
  shouldClaimToken?: boolean;
}

export function LoginButton({ token, shouldClaimToken = true }: Props) {
  const [state, setState] = useState<State>('idle');

  const handleSignIn = async () => {
    try {
      setState('pending');
      await signIn('github', { callbackUrl: '/explore' });

      // after a successful sign we should claim the token so it cant be reused
      if (shouldClaimToken && token) {
        await claimBetaToken(token.id);
      }
    } catch (error) {
      setState('error');
    }
  };

  return (
    <Button disabled={state === 'pending'} variant="outline" onClick={handleSignIn}>
      Github
    </Button>
  );
}
