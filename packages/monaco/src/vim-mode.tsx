'use client';

import type * as monaco from 'monaco-editor';
import { useEffect, useRef } from 'react';
import { VimMode, initVimMode } from 'monaco-vim';
import { useEditorSettingsStore } from './settings-store';

interface VimStatusBarProps {
  editor: monaco.editor.IStandaloneCodeEditor;
}

// `K` -> hover
VimMode.Vim.defineAction('hover', function (ctx) {
  // it didn't work without the set timeout, it probably handles the key after and dismisses it
  setTimeout(() => ctx.editor.getAction('editor.action.showHover')?.run());
});
VimMode.Vim.mapCommand('K', 'action', 'hover');

export function VimStatusBar({ editor }: VimStatusBarProps) {
  const statusBarRef = useRef<HTMLDivElement | null>(null);
  const vimModeRef = useRef<VimMode>();
  const { settings } = useEditorSettingsStore();

  useEffect(() => {
    if (settings.bindings === 'vim') {
      vimModeRef.current = initVimMode(editor, statusBarRef.current);

      return () => vimModeRef.current?.dispose();
    }

    vimModeRef.current?.dispose();
    vimModeRef.current = undefined;

    if (statusBarRef.current) {
      statusBarRef.current.textContent = '';
    }
  }, [editor, settings.bindings]);

  return (
    <div className="flex w-full">
      <div
        className="gap-2 font-mono text-sm [&>*:first-child]:mr-2 [&_input]:border-none [&_input]:bg-transparent [&_input]:outline-none"
        ref={statusBarRef}
      />
    </div>
  );
}
