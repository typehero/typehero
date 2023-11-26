'use client';

import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import remarkGfm from 'remark-gfm';
import { vscDarkPlus } from '../themes/vs-dark-plus';
import { vs } from '../themes/vs';
import clsx from 'clsx';
import { visit, SKIP, type BuildVisitor } from 'unist-util-visit';
import type { Transformer } from 'unified';
import { useTheme } from 'next-themes';
import rehypeRaw from 'rehype-raw';

const HTML_COMMENT_REGEX = new RegExp('<!--([\\s\\S]*?)-->', 'g');

/**
 * Remove HTML comments from Markdown
 */
function removeHtmlComments(): Transformer {
  return (tree) => {
    // TODO: PRs are welcomed to fix the any type
    // eslint-disable-next-line
    const handler: BuildVisitor<any> = (node, index, parent) => {
      const isComment = node.value.match(HTML_COMMENT_REGEX);

      if (isComment) {
        // remove node
        parent.children.splice(index, 1);
        // Do not traverse `node`, continue at the node *now* at `index`. http://unifiedjs.com/learn/recipe/remove-node/
        return [SKIP, index];
      }
    };

    visit(tree, 'html', handler);

    // TODO: is this needed
    visit(tree, 'jsx', handler);
  };
}

export function Markdown({ children, className }: { children: string; className?: string }) {
  const { theme } = useTheme();
  const syntaxHighlighterTheme = theme === 'light' ? vs : vscDarkPlus;

  return (
    <ReactMarkdown
      skipHtml
      className={className}
      components={{
        a: ({ className, ...props }) => (
          <a className={clsx(className, 'text-blue-500')} {...props} />
        ),
        ul: ({ className, ...props }) => (
          <ul className={clsx(className, 'list-disc ps-10')} {...props} />
        ),
        h1: ({ className, ...props }) => (
          <h1 className={clsx(className, 'mb-2 pb-2 text-3xl font-bold')} {...props} />
        ),
        h2: ({ className, ...props }) => (
          <h2 className={clsx(className, 'mb-2 pb-2 text-2xl font-bold')} {...props} />
        ),
        h3: ({ className, ...props }) => (
          <h3 className={clsx(className, 'mb-2 pb-2 text-xl font-bold')} {...props} />
        ),
        p: ({ className, ...props }) => <p className={clsx(className, 'mb-4')} {...props} />,
        code({ inline, className, children, style: _, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              PreTag="section" // parent tag
              className={clsx(className, 'rounded-xl dark:rounded-md')}
              language={match[1]}
              style={syntaxHighlighterTheme} // theme
              customStyle={{ fontSize: 'inherit' }}
              codeTagProps={{
                style: {
                  // overrides
                  fontSize: 'inherit',
                  lineHeight: 'inherit',
                },
              }}
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className="rounded-md border border-zinc-300 bg-neutral-200 px-1 py-[0.10rem] font-mono text-zinc-600 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
              {children}
            </code>
          );
        },
        details: ({ ...props }) => <details {...props} />,
        summary: ({ ...props }) => <summary {...props} />,
      }}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rehypePlugins={[rehypeRaw as any]}
      remarkPlugins={[removeHtmlComments, remarkGfm]}
    >
      {children}
    </ReactMarkdown>
  );
}
