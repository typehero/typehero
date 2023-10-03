'use client';

import Editor, { loader, type EditorProps } from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import { useMemo } from 'react';
import { useEditorSettingsStore } from './settings-store';
import { libSource } from './editor-types';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import * as MonacoEditor from 'monaco-editor';

const ADMIN_HOST = 'admin.typehero.dev';
const getBaseUrl = () => {
  if (typeof globalThis.window === 'undefined') return '';
  const isProd = process.env.NODE_ENV === 'production';
  if (isProd && window?.location?.hostname === ADMIN_HOST) {
    return 'https://typehero.dev';
  }

  if (!isProd && window?.location?.port === '3001') {
    return 'http://localhost:3000';
  }

  return '';
};

loader.config({
  paths: {
    vs: `${getBaseUrl()}/min/vs`,
  },
});

const DEFAULT_OPTIONS = {
  fixedOverflowWidgets: true,
  lineNumbers: 'on',
  tabSize: 2,
  insertSpaces: false,
  minimap: {
    enabled: false,
  },
  fontSize: 16,
} as const satisfies EditorProps['options'];

export const LIB_URI = 'file:///asserts.d.ts';

export function loadCheckingLib(monaco: typeof MonacoEditor) {
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
