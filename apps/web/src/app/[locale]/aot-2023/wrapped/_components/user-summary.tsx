import { prisma } from '@repo/db';
import Image from 'next/image';
import { AOT_CHALLENGES } from '~/app/[locale]/challenge/[slug]/aot-slugs';
import { MotionDiv } from '~/components/motion';

export async function UserSummary() {
  const totalNumberOfAccountsDuringAot = await prisma.user.count({
    where: {
      createdAt: {
        gte: new Date('2023-12-01T00:00:00.000Z'),
        lte: new Date('2023-12-25T23:59:59.999Z'),
      },
    },
  });
  const totalAotSubmissions = await prisma.submission.count({
    where: {
      challenge: {
        slug: {
          in: AOT_CHALLENGES,
        },
      },
    },
  });
  const incorrectAotSubmissions = await prisma.submission.count({
    where: {
      challenge: {
        slug: {
          in: AOT_CHALLENGES,
        },
      },
      isSuccessful: false,
    },
  });
  const correctAotSubmissions = await prisma.submission.count({
    where: {
      challenge: {
        slug: {
          in: AOT_CHALLENGES,
        },
      },
      isSuccessful: true,
    },
  });

  return (
    <div className="h-screen w-full bg-red-800 text-white">
      <div className="flex h-full">
        <div className="hidden h-full w-full items-center justify-center border-r border-r-white/50 md:flex">
          <MotionDiv animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
            <Image src="/aot/santa_flying.png" width={200} height={200} alt="" />
          </MotionDiv>
        </div>
        <div className="relative h-full w-full p-6">
          <div className="absolute left-6 top-6 text-4xl font-semibold tracking-tighter md:text-5xl">
            General Metrics
          </div>
          <div className="flex h-full flex-col gap-7 pt-36 md:justify-center md:pt-0">
            <Image
              src="/aot/santa_flying.png"
              width={100}
              height={100}
              alt=""
              className="md:hidden"
            />
            <div className="flex items-end gap-5">
              <div className="text-2xl font-bold md:w-44 md:text-6xl">
                {formatThousandsWithK(totalNumberOfAccountsDuringAot)}
              </div>
              <div className="text-md md:text-2xl">Accounts Created</div>
            </div>
            <div className="flex items-end gap-5">
              <div className="text-2xl font-bold md:w-44 md:text-6xl">150K</div>
              <div className="text-md md:text-2xl">AOT Page Visits</div>
            </div>
            <div className="flex items-end gap-5">
              <div className="text-2xl font-bold md:w-44 md:text-6xl">
                {formatThousandsWithK(totalAotSubmissions)}
              </div>
              <div className="text-md md:text-2xl">Total Submissions</div>
            </div>
            <div className="flex items-end gap-5">
              <div className="text-2xl font-bold md:w-44 md:text-6xl">
                {formatThousandsWithK(incorrectAotSubmissions)}
              </div>
              <div className="text-md md:text-2xl">Total Incorrect Submissions</div>
            </div>
            <div className="flex items-end gap-5">
              <div className="text-2xl font-bold md:w-44 md:text-6xl">
                {formatThousandsWithK(correctAotSubmissions)}
              </div>
              <div className="text-md md:text-2xl">Total Correct Submissions</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const formatter = Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

function formatThousandsWithK(num: number) {
  if (num < 1000) return num;

  return formatter.format(num);
}
