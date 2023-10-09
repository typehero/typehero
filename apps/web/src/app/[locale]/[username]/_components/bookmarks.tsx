'use client';

import type { UserPrivateProfile } from "../_components/profile.actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/card";
import { DifficultyBadge } from "@repo/ui/components/difficulty-badge";
import { MessageCircle, ThumbsUp } from "@repo/ui/icons";
import RelativeTime from "~/app/[locale]/explore/_components/relative-time";
import { Markdown } from "@repo/ui/components/markdown";
import { BORDERS_BY_DIFFICULTY, SHADOWS_BY_DIFFICULTY } from "~/app/[locale]/explore/_components/explore-card";
import Link from "next/link";

interface UserBookmarksProps {
  privateUser: NonNullable<UserPrivateProfile>,
}

export const Bookmarks = ({ privateUser }: UserBookmarksProps) => {
  return (
    <div className="flex flex-col items-center md:items-start md:flex-row flex-wrap gap-4">
      {
        privateUser.bookmark.map(({ challenge }, idx) => {
          if (!challenge) return null;
          return (
          <Link key={`bookmark-challenge-${idx}`} href={`/challenge/${challenge.id}`}>
            <Card
              className={`group/card bg-background hover:bg-card-hovered relative overflow-hidden duration-300 w-[300px]
      ${SHADOWS_BY_DIFFICULTY[challenge.difficulty]}
      ${BORDERS_BY_DIFFICULTY[challenge.difficulty]}
      `}
            >
              <CardHeader className="relative flex flex-col items-start gap-1 py-5">
                <CardTitle className="max-w-[75%] truncate duration-300">
                  {challenge.name}
                </CardTitle>
                <div className="flex items-center gap-6 text-center duration-300">
                  <DifficultyBadge difficulty={challenge.difficulty} />
                  <div className="flex items-center gap-2 text-sm">
                    <MessageCircle size={18} />
                    {challenge._count.comment}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <ThumbsUp size={18} />
                    {challenge._count.vote}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative flex flex-col justify-between gap-2 rounded-xl p-6 pt-0 pb-0 duration-300">
                <div className="flex items-center gap-2">
                  <div className="-ml-[0.33rem] flex h-auto w-fit items-center whitespace-nowrap rounded-full bg-transparent py-1 pl-[0.33rem] pr-2 text-xs font-bold text-neutral-700 duration-300 hover:bg-black/10 dark:text-white dark:hover:bg-white/20">
                    @{challenge.user.name}
                  </div>
                  <div className="text-muted-foreground whitespace-nowrap text-sm">
                    <RelativeTime date={challenge.updatedAt} />
                  </div>
                </div>
                <CardDescription className="relative h-20 pb-4">
                  <div className="pointer-events-none text-sm absolute inset-0 h-full w-full shadow-[inset_0_-1.5rem_1rem_-0.5rem_hsl(var(--card))] duration-300 group-hover/card:shadow-[inset_0_-1.5rem_1rem_-0.5rem_hsl(var(--card-hovered))] group-focus:shadow-[inset_0_-1.5rem_1rem_-0.5rem_hsl(var(--card-hovered))]" />
                  <Markdown>{challenge.shortDescription}</Markdown>
                </CardDescription>
              </CardContent>
            </Card>
            </Link>
          );
        })
      }
      {
        privateUser.bookmark.length === 0 ? (
          <div className="flex w-full flex-col items-center justify-center gap-2">
              <span className="text-base md:text-lg font-semibold">type NoBookmarks</span>
              <span className="text-sm text-muted-foreground text-center">We couldn&apos;t find any bookmarks. Try adding one!</span>
          </div>
        ) : null
      }
    </div>

  );
}

