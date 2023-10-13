'use client';

import { signIn } from '@repo/auth/react';
import { Button } from '@repo/ui/components/button';
import { useState } from 'react';

type State = 'error' | 'idle' | 'pending' | 'success';

export function LoginButton({ redirectTo }: { redirectTo: string }) {
  const [state, setState] = useState<State>('idle');

  const handleSignIn = async () => {
    try {
      setState('pending');
      await signIn('github', { callbackUrl: redirectTo });
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
