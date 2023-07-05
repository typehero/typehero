'use client';

import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import remarkGfm from 'remark-gfm';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ ...props }) => <p className="mb-4" {...props} />,
        code({ inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              // @ts-ignore
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
      {children}
    </ReactMarkdown>
  );
}
