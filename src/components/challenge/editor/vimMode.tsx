'use client';

import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { initVimMode, type VimEditorMode, type VimMode } from 'monaco-vim';
import { useEffect, useRef, useState } from 'react';
import { useEditorSettingsStore } from '../settings-store';

interface Props {
  editor: monaco.editor.IStandaloneCodeEditor;
}

// simple color map for vim mode
// TODO: make these look better on light mode
const ColorMap = {
  normal: {
    bg: '#a3be8c',
    fg: '#3b4252',
  },
  insert: {
    bg: '#d8cf6c',
    fg: '#3b4252',
  },
  visual: {
    bg: '#f080f2',
    fg: '#3b4252',
  },
};

export const VimStatusBar = ({ editor }: Props) => {
  const statusBarRef = useRef<HTMLDivElement | null>(null);
  const vimModeRef = useRef<VimMode>();
  const { settings } = useEditorSettingsStore();
  const [mode, setMode] = useState<VimEditorMode>('normal');

  /** if the editor is in vim mode */
  const isVimMode = settings.bindings === 'vim';

  useEffect(() => {
    if (isVimMode) {
      if (!vimModeRef.current) {
        vimModeRef.current = initVimMode(editor, statusBarRef.current);

        // use the vim-mode-change event to update the mode so we can makes pretty
        vimModeRef.current.on('vim-mode-change', (event) => {
          setMode(event.mode);
        });
      }
    } else {
      vimModeRef.current?.dispose();
      vimModeRef.current = undefined;
    }
  }, [editor, isVimMode, settings.bindings]);

  // colors for the vim mode foreground and background
  const { bg, fg } = ColorMap[mode];

  return (
    <div className="flex w-full p-1">
      {isVimMode && (
        <div style={{ background: bg, color: fg }} className="rounded-md pl-2 pr-2 font-mono">
          {mode.toUpperCase()}
        </div>
      )}
    </div>
  );
};
