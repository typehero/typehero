'use client';

import { ChallengeLayout } from '~/components/challenge/challenge-layout';
import { Textarea } from '~/components/ui/textarea';
import { CodePanel } from '~/components/challenge/editor';
import { useState } from 'react';
import { Checkbox } from '~/components/ui/checkbox';
import { Label } from '~/components/ui/label';
import { Markdown } from '~/components/ui/markdown';

export default function CreateChallenge() {
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [md, setMd] = useState('');

  function onSubmit(code: string) {
    // TODO actually make this upload a challenge
    // maybe add a preview first?
    console.log('submitted:', { code, md });
  }

  return (
    <ChallengeLayout
      left={
        <div className="flex h-full flex-col gap-3 border-zinc-300 p-4 dark:border-zinc-700">
          {isPreviewing ? (
            <div className="prose-invert flex-1 leading-8 prose-h3:text-xl">
              <Markdown>{md}</Markdown>
            </div>
          ) : (
            <Textarea
              className="flex-1 resize-none dark:border-white"
              value={md}
              onChange={(ev) => setMd(ev.currentTarget.value)}
            />
          )}
          <div className="flex items-center justify-end space-x-2">
            <Label
              htmlFor="preview"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Preview:
            </Label>
            <Checkbox
              id="preview"
              checked={isPreviewing}
              onCheckedChange={(checked) => setIsPreviewing(checked === true)}
            />
          </div>
        </div>
      }
      right={<CodePanel mode="create" onSubmit={onSubmit} />}
    />
  );
}
