'use client';

import { ChallengeLayout } from '../../components/challenge/challenge-layout';
import { Textarea } from '../../components/ui/textarea';
import { CodePanel } from '../../components/challenge/editor';
import { useState } from 'react';
import { Checkbox } from '../../components/ui/checkbox';
import { Label } from '../../components/ui/label';
import remarkGfm from 'remark-gfm';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/default-highlight';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function CreateChallenge() {
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [md, setMd] = useState('');

  return (
    <ChallengeLayout
      left={
        <div className="flex h-full flex-col gap-3 border-zinc-300 p-4 dark:border-zinc-700">
          {isPreviewing ? (
            <div className="prose-invert flex-1 leading-8 prose-h3:text-xl">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ ...props }) => <p className="mb-4" {...props} />,
                  code({ inline, className, children, style: _style, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');

                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus} // theme
                        className="rounded-xl dark:rounded-md"
                        language={match[1]}
                        PreTag="section" // parent tag
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className="rounded-md bg-neutral-200 p-1 font-mono dark:bg-black">
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {md}
              </ReactMarkdown>
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
      right={<CodePanel mode="create" onSubmit={console.log} />}
    />
  );
}
