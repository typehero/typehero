'use client';

import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import remarkGfm from 'remark-gfm';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import clsx from 'clsx';

export function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ className, ...props }) => (
          <h1
            className={clsx(className, 'mb-2 border-b border-zinc-500 pb-2 text-3xl font-bold')}
            {...props}
          />
        ),
        p: ({ className, ...props }) => <p className={clsx(className, 'mb-4')} {...props} />,
        code({ inline, className, children, style: _, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              style={vscDarkPlus} // theme
              className={clsx(className, 'rounded-xl dark:rounded-md')}
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
      {children}
    </ReactMarkdown>
  );
}
