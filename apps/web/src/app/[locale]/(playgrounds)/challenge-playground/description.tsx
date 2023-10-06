'use client';

import { RichMarkdownEditor } from '~/components/rich-markdown-editor';
import { useChallengePlaygroundStore } from './challenge-playground-store';

export function Description() {
  const { values, updateValues } = useChallengePlaygroundStore();
  return (
    <RichMarkdownEditor
      onChange={(v) => updateValues({ ...values, prompt: v as string })}
      value={values.prompt}
    />
  );
}
