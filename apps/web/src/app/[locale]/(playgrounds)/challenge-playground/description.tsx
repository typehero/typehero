'use client';

import { useState } from 'react';
import { RichMarkdownEditor } from '~/components/rich-markdown-editor';

export function Description() {
  const [value, setValue] = useState('### Description');
  return <RichMarkdownEditor onChange={(v) => setValue(v as string)} value={value} />;
}
