'use client';

import type * as monaco from 'monaco-editor';
import { useEffect, useRef } from 'react';
import { useEditorSettingsStore } from '../settings-store';
import { type VimMode, initVimMode } from 'monaco-vim';

interface VimStatusBarProps {
  editor: monaco.editor.IStandaloneCodeEditor;
}
export const VimStatusBar = ({ editor }: VimStatusBarProps) => {
  const statusBarRef = useRef<HTMLDivElement | null>(null);
  const vimModeRef = useRef<VimMode>();
  const { settings } = useEditorSettingsStore();

  useEffect(() => {
    if (settings.bindings === 'vim') {
      if (!vimModeRef.current) {
        vimModeRef.current = initVimMode(editor, statusBarRef.current);
      }
    } else {
      vimModeRef.current?.dispose();
      vimModeRef.current = undefined;
      if (statusBarRef.current) {
        statusBarRef.current.textContent = '';
      }
    }
  }, [editor, settings.bindings]);

  return (
    <div className="flex w-full">
      <div ref={statusBarRef} className="font-mono" />
    </div>
  );
};
