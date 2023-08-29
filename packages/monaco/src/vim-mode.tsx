'use client';

import type * as monaco from 'monaco-editor';
import { useEffect, useRef } from 'react';
import { VimMode, initVimMode } from 'monaco-vim';
import { useEditorSettingsStore } from './settings-store';
import { defaultVimConfig, sourceVimCommands } from './vim-keybindings';

VimMode.Vim.defineEx('MonacoCommand', 'M', function monacoExCommand(ctx, { args }) {
  if (!args) {
    throw new TypeError('Expected an action to run');
  }

  // workaround for vim mode not substituting `<Space>` with ` `
  if (args[0].startsWith('<Space>')) {
    args[0] = args[0].slice(7);
  }

  console.log('running monaco command', args);

  ctx.editor.trigger('exCommand', args[0], null);
});

interface VimStatusBarProps {
  editor: monaco.editor.IStandaloneCodeEditor;
}

export function VimStatusBar({ editor }: VimStatusBarProps) {
  const statusBarRef = useRef<HTMLDivElement>(null);
  // NOTE: Maybe doesn't need to be a ref anymore?
  const vimModeRef = useRef<VimMode>();
  const { settings } = useEditorSettingsStore();

  useEffect(() => {
    if (settings.bindings === 'vim') {
      vimModeRef.current = initVimMode(editor, statusBarRef.current);

      VimMode.Vim.maybeInitVimState_(vimModeRef.current);

      sourceVimCommands(vimModeRef.current, defaultVimConfig);

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
