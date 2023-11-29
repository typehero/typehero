'use client';

import { cn } from '@repo/ui/cn';
import { Button } from '@repo/ui/components/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@repo/ui/components/sheet';
import { BadgeInfo } from '@repo/ui/icons';

export function About({ className }: { className?: string }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          asChild
          className={cn(
            className,
            'flex cursor-pointer items-center gap-2 rounded-xl border-2 px-4 py-2 dark:text-white',
          )}
          variant="outline"
        >
          <span>
            <BadgeInfo className="h-4 w-4" />
            About
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent
        className="flex w-full flex-col gap-8 overflow-y-scroll sm:max-w-[400px] md:max-w-[700px]"
        side="right"
      >
        <SheetHeader>
          <SheetTitle>
            <h2 className="text-4xl font-semibold tracking-tighter">About</h2>
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-5 text-lg tracking-tight">
          <p>
            The TypeHero team wants to thank you for taking part in our first Advent of TypeScript.
            We hope you find the challenges interesting and pick up something new as you go! If you
            like what you see, consider sharing the event with your friends. And if you have any
            questions, feel free to reach out to us on Discord or GitHub.
          </p>
          <h3 className="text-2xl font-semibold tracking-tighter">Tips</h3>
          <p>
            <span className="font-bold text-red-600">1.</span> You might find using the{' '}
            <a
              href="https://www.typescriptlang.org/play"
              className="font-bold underline"
              target="_blank"
              rel="noreferrer noopener"
            >
              TypeScript Playground
            </a>{' '}
            preferred over our editor(at least for now 🤐). Just copy the code from the test
            section, start coding, and when you nail it, pop your code (except the tests) back into
            our editor.
          </p>
          <p>
            <span className="font-bold text-red-600">2.</span> The test cases are your friends!
            They’ll guide you through what we’re asking for. When things get trickier, these cases
            will be your trusty helpers.
          </p>
          <p>
            <span className="font-bold text-red-600">3.</span> There’s a channel in our{' '}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://discord.com/invite/KPNUNQRB"
              className="font-bold text-[#5865F2] underline"
            >
              discord
            </a>{' '}
            just for chewing over these challenges. Jump in, chat, and share your thoughts on
            solutions. We highly recommend it!
          </p>
          <p>
            <span className="font-bold text-red-600">4.</span> Remember, it’s all about having fun!
            These challenges are meant to tease your brain. They’ll ramp up real quick 🙈. Don’t
            sweat it if a challenge feels tough. We’ll drop the solutions on our{' '}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://github.com/typehero/typehero"
              className="font-bold  underline"
            >
              Github
            </a>{' '}
            after the event, so be sure to give it a star!
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
