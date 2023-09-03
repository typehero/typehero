'use client';

import type { PropsWithChildren } from 'react';

interface Props {
  title: string;
  description: React.ReactNode;
}

function EditorShortcut(props: Props) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <h1>{props.title}</h1>
      {props.description}
    </div>
  );
}

const Key = (props: PropsWithChildren) => {
  return (
    <kbd className="rounded-md border border-zinc-300 bg-neutral-200 p-1 py-0.5 font-mono text-xs text-zinc-600 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
      {props.children}
    </kbd>
  );
};

export function EditorShortcuts() {
  return (
    <div className="flex flex-col gap-2">
      <EditorShortcut
        title="Run Code"
        description={
          <p>
            <Key>Ctrl</Key> + <Key>'</Key>
          </p>
        }
      />
      <EditorShortcut
        title="Submit"
        description={
          <p>
            <Key>Ctrl</Key> + <Key>Enter</Key>
          </p>
        }
      />
      <EditorShortcut
        title="Debug Code"
        description={
          <p>
            <Key>Ctrl</Key> + <Key>Alt</Key> + <Key>'</Key>
          </p>
        }
      />
      <EditorShortcut
        title="To indent one level"
        description={
          <p>
            <Key>Tab</Key> + <Key>Ctrl</Key>
          </p>
        }
      />
      <EditorShortcut
        title="To indent one fewer levels"
        description={
          <p>
            <Key>Shift</Key> + <Key>Tab</Key>
          </p>
        }
      />
      <EditorShortcut
        title="To move lines up/down"
        description={
          <p>
            <Key>Alt</Key> + <Key>Up/Down</Key>
          </p>
        }
      />
      <EditorShortcut
        title="Delete line and copy to buffer"
        description={
          <p>
            <Key>Ctrl</Key> + <Key>X</Key>
          </p>
        }
      />
      <EditorShortcut
        title="Comment/uncomment current selection"
        description={
          <p>
            <Key>Ctrl</Key> + <Key>/</Key>
          </p>
        }
      />
      <EditorShortcut
        title="Undo action"
        description={
          <p>
            <Key>Ctrl</Key> + <Key>Z</Key>
          </p>
        }
      />
      <EditorShortcut
        title="Redo action"
        description={
          <p>
            <Key>Ctrl</Key> + <Key>Shift</Key> + <Key>Z</Key>
          </p>
        }
      />
    </div>
  );
}
