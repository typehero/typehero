'use client';

import Editor, { type OnChange, type OnMount } from '@monaco-editor/react';
import type * as monaco from 'monaco-editor';
import { useTheme } from 'next-themes';
import { useMemo } from 'react';
import { useEditorSettingsStore } from '../challenge/settings-store';

const DEFAULT_OPTIONS = {
  lineNumbers: 'on',
  tabSize: 2,
  insertSpaces: false,
  minimap: {
    enabled: false,
  },
  fontSize: 16,
} as const satisfies monaco.editor.IStandaloneEditorConstructionOptions;

interface Props {
  onChange?: OnChange;
  onMount?: OnMount;
  options?: monaco.editor.IStandaloneEditorConstructionOptions;
  value: string;
}
export function CodeEditor({ onChange, onMount, options, value }: Props) {
  const { theme } = useTheme();
  const editorTheme = theme === 'light' ? 'vs' : 'vs-dark';
  const { settings } = useEditorSettingsStore();
  const editorOptions = useMemo(() => {
    return {
      ...DEFAULT_OPTIONS,
      ...settings,
      fontSize: parseInt(settings.fontSize),
      tabSize: parseInt(settings.tabSize),
      ...options,
    };
  }, [settings]);

  return (
    <Editor
      theme={editorTheme}
      options={editorOptions}
      defaultLanguage="typescript"
      onMount={onMount}
      value={value}
      onChange={onChange}
    />
  );
}
