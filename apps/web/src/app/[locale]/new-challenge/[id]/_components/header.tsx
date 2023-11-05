'use client';

import { Tabs, TabsList, TabsTrigger } from "@repo/ui/components/tabs";
import { useParams, useRouter } from "next/navigation";

export interface HeadersProps {
  challengeId?: string;
  slug?: string;
}

export default function Headers({ challengeId, slug}: HeadersProps) {

  const params = useParams<{id: string}>();
  const router = useRouter();

  return (
    <Tabs className="flex w-full flex-col overflow-hidden" defaultValue={'description'}>
      <TabsList className="bg-background/90 dark:bg-muted/90 sticky top-0 z-10 grid h-auto w-full grid-cols-3 rounded-none rounded-tl-2xl rounded-tr-xl border-b border-zinc-300 backdrop-blur-sm dark:border-zinc-700">
        <TabsTrigger
          className="rounded-md rounded-tl-xl duration-300 data-[state=active]:bg-neutral-200 dark:data-[state=active]:bg-neutral-700"
          onClick={() => router.push(`/${slug}/${params.id}`)}
          value="description"
        >
          Description
        </TabsTrigger>
        <TabsTrigger
          className="rounded-md duration-300 data-[state=active]:bg-neutral-200 dark:data-[state=active]:bg-neutral-700"
          onClick={() => router.push(`/${slug}/${params.id}/solutions`)}
          value="solutions"
        >
          Solutions
        </TabsTrigger>
        <TabsTrigger
          className="rounded-md rounded-tr-lg duration-300 data-[state=active]:bg-neutral-200 dark:data-[state=active]:bg-neutral-700"
          onClick={() => router.push(`/${slug}/${params.id}/submissions`)}
          value="submissions"
        >
          Submissions
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}