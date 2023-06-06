'use client';

import ReactMarkdown from 'react-markdown';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';

interface Props {
  description: string;
}
export function DescriptionPanel({ description: markdown }: Props) {
  return (
    <div className="flex-1 rounded-md bg-white dark:bg-zinc-800">
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="solutions">Solutions</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-0">
          <div className="prose-invert prose-h3:text-xl">
            <ReactMarkdown children={markdown} />
          </div>
        </TabsContent>
        <TabsContent value="solutions">
          <div className="p-4">solu</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
