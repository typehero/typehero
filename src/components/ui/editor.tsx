'use client';
import Editor, { loader } from '@monaco-editor/react';
import { useTheme } from 'next-themes';

export interface EditorProps {
  value: string;
}

loader.config({
  paths: {
    vs: '/vs',
  },
});
/**
 * @description Used as a read-only monaco editor. Respects theme values, disables minimap.
 */
export default function ReadOnlyEditor({ value }: EditorProps) {
  const { theme } = useTheme();
  return (
    <Editor
      value={value}
      theme={theme === 'light' ? 'vs' : 'vs-dark'}
      defaultLanguage="typescript"
      options={{
        readOnly: true,
        minimap: {
          enabled: false,
        },
      }}
    />
  );
}
