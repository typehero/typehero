'use client';

import { Button } from '@repo/ui/components/button';
import { Github } from '@repo/ui/icons';
import { signIn } from '@repo/auth/react';
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
    <div className="mx-auto rounded-md duration-300 hover:shadow-[0_0_2rem_-0.5rem_#3178c6]">
      <Button
        variant="outline"
        onClick={handleSignIn}
        disabled={state === 'pending'}
        className="fancy-border-gradient hover:bg-background relative mx-auto flex gap-4 border-none"
      >
        Login with GitHub <Github className="size-5" />
      </Button>
    </div>
  );
}
