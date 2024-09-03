'use client';

import { LoginButton } from '../login/_components/LoginButton';

export default function ErrorBounds() {
  return (
    <div className="-mt-[56px] container flex h-screen flex-col items-center justify-center">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 text-center sm:w-[450px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="mb-5 font-bold text-4xl text-neutral-900 tracking-tight dark:text-white">
              You must be logged in to see notifications.
            </h1>
          </div>
          <LoginButton redirectTo="/notifications" />
        </div>
      </div>
    </div>
  );
}
