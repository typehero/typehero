'use client';

import { RichMarkdownEditor } from '@repo/ui/components/rich-markdown-editor';
import { useChallengePlaygroundStore } from './challenge-playground-store';
import { useUploadThing } from '~/utils/useUploadthing';

export function Description() {
  const { values, updateValues } = useChallengePlaygroundStore();
  return (
    <RichMarkdownEditor
      onChange={(v) => updateValues({ ...values, prompt: v as string })}
      value={values.prompt}
      useUploadThing={useUploadThing}
    />
  );
}
