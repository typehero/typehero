'use client';

import Editor, { loader, type EditorProps } from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import { useMemo } from 'react';
import { useEditorSettingsStore } from './settings-store';
import { libSource } from './editor-types';

function getBaseUrl() {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

loader.config({
  paths: {
    vs: `${getBaseUrl()}/min/vs`,
  },
});

const DEFAULT_OPTIONS = {
  lineNumbers: 'on',
  tabSize: 2,
  insertSpaces: false,
  minimap: {
    enabled: false,
  },
  fontSize: 16,
} as const satisfies EditorProps['options'];

export const LIB_URI = 'file:///asserts.d.ts';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
export function loadCheckingLib(monaco: typeof import('monaco-editor')) {
  if (!monaco.editor.getModel(monaco.Uri.parse(LIB_URI))) {
    monaco.languages.typescript.javascriptDefaults.addExtraLib(libSource, LIB_URI);
    monaco.editor.createModel(libSource, 'typescript', monaco.Uri.parse(LIB_URI));
  }
}

export type CodeEditorProps = Omit<EditorProps, 'theme'>;

export function CodeEditor({ onChange, onMount, options, value, ...props }: CodeEditorProps) {
  const { theme } = useTheme();
  const editorTheme = theme === 'light' ? 'light' : 'vs-dark';
  const { settings } = useEditorSettingsStore();
  const editorOptions = useMemo(() => {
    return {
      ...DEFAULT_OPTIONS,
      ...settings,
      fontSize: parseInt(settings.fontSize),
      tabSize: parseInt(settings.tabSize),
      ...options,
    };
  }, [options, settings]);

  return (
    <Editor
      {...props}
      defaultLanguage="typescript"
      onChange={onChange}
      onMount={onMount}
      options={editorOptions}
      theme={editorTheme}
      value={value}
    />
  );
}
