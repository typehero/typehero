'use client';

import { LoginButton } from '../login/_components/LoginButton';

export default function ErrorBounds() {
  return (
    <div className="container -mt-[56px] flex h-screen flex-col items-center justify-center">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 text-center sm:w-[450px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="mb-5 text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
              You must be logged in to see notifications.
            </h1>
          </div>
          <LoginButton redirectTo="/notifications" />
        </div>
      </div>
    </div>
  );
}
