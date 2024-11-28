import { Button } from '@repo/ui/components/button';
import { Github } from '@repo/ui/icons';
import type { Metadata } from 'next';
import styles from '../support/support.module.css';
import { Footsies } from '~/components/footsies';

export const metadata: Metadata = {
  title: 'About the Platform',
};

export default function AboutPage() {
  return (
    <>
      <div className="prose dark:prose-invert container relative flex flex-col p-4 py-8 text-lg">
        <div className="not-prose leading-9">
          <p className="mb-6 text-balance">
            Thank you for joining us for{' '}
            <span className="bg-gradient-to-br from-rose-400 to-rose-600 bg-clip-text font-bold text-transparent duration-300 hover:underline">
              Advent of TypeScript
            </span>
            ! The{' '}
            <span className="bg-gradient-to-br from-blue-400 to-blue-600 bg-clip-text font-bold text-transparent duration-300 hover:underline">
              TypeHero
            </span>{' '}
            team is thrilled to unveil our brand-new platform, designed not just for this year's
            event but for many more to come. We hope you enjoy the challenges, learn something new
            along the way, and have a great time participating. If you’re enjoying the experience,
            we’d love it if you shared the event with your friends to help it grow even more! If you
            have any questions, spot any bugs, or want to share feedback, don’t hesitate to connect
            with us on Discord or GitHub. We're here to help!
          </p>

          <p className="mb-6">
            If you have any questions, find bugs, or just have feedback please feel free to reach
            out to us on our Discord or GitHub.
          </p>

          <div className="mb-6 flex flex-col items-center gap-5 md:flex-row">
            <a
              target="_blank"
              rel="noreferrer"
              href="https://discord.com/invite/WjZhvVbFHM"
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#5865F2] px-3 py-2 text-sm font-bold text-white duration-300 md:w-auto dark:bg-[#5865F2]"
            >
              <svg
                className="h-4 w-4 fill-current group-hover:rotate-[360deg]"
                role="img"
                style={{ transition: 'color 0s, transform 0.3s' }}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Discord</title>
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
              </svg>
              Join the Discord
            </a>
            <Button
              asChild
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 px-4 py-2 md:w-auto dark:text-white"
              variant="outline"
            >
              <a
                target="_blank"
                rel="noreferrer"
                className="gap-1 md:inline-flex"
                href="https://github.com/typehero/typehero"
              >
                <Github className="h-4 w-4" />
                Star us on GitHub
              </a>
            </Button>
            <Button
              asChild
              className={`${styles.donateStripeLinkBtn} group relative w-fit overflow-hidden rounded-xl border-none p-0 font-bold !ring-0 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:duration-75 dark:p-[1px]`}
              variant="outline"
            >
              <a href="https://donate.stripe.com/14k5kv1uv0e57yU4gh">
                <span className="inline-flex h-full w-fit items-center gap-2 rounded-xl bg-black px-4 py-2 text-white transition-all duration-300 dark:bg-neutral-900 dark:text-white">
                  Click to Donate
                </span>
              </a>
            </Button>
          </div>
        </div>
        <h2>Tips</h2>
        <ul>
          <li>
            You might find using the{' '}
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
          </li>
          <li>
            The test cases are your friends! They’ll guide you through what we’re asking for. When
            things get trickier, these cases will be your trusty helpers.
          </li>
          <li>
            Join the advent-of-typescript channel in our discord linked above just for chewing over
            these challenges. Jump in, chat, and share your thoughts on solutions. We highly
            recommend it!
          </li>
          <li>
            Remember, it’s all about having fun! These challenges are meant to tease your brain.
            They’ll ramp up real quick 🙈. Don’t sweat it if a challenge feels tough. Everyone will
            be able to share their own solutions at the end of the event.
          </li>
        </ul>
        <h2>Rewards</h2>
        <p>
          This year, we're introducing <strong>leaderboards</strong>📈! You'll find a daily
          leaderboard and an overall leaderboard, where top contestants can win exciting prizes.
          Join the discord to stay updated on the latest announcements about prizes!
        </p>
        <p>
          Here's how scoring works: each day, the first 100 participants will earn points based on
          their rank. First place gets 100 points, second place earns 99, third place gets 98, and
          so on, decreasing by one point per rank.
        </p>
        <p>
          But that's not all — you can collect Advent of TypeScript badges! Once unlocked, these
          badges will be displayed on your public profile as a testament to your achievements. You
          can view your profile on our shared platform at typehero.dev. Happy coding and good luck!
          ☃️
        </p>
      </div>
      <Footsies />
    </>
  );
}
