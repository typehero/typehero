import Editor, {
  loader,
  type EditorProps,
  type OnChange,
  type OnMount,
  type Theme,
} from '@monaco-editor/react';
import type { editor } from 'monaco-editor';

export interface CodeEditorProps extends EditorProps {
  onChange?: OnChange;
  onMount?: OnMount;
  options?: editor.IStandaloneEditorConstructionOptions;
  theme: Theme;
  value: string;
}

loader.config({
  paths: {
    vs: '/vs',
  },
});

export function CodeEditor({
  onChange,
  onMount,
  options,
  theme,
  value,
  ...props
}: CodeEditorProps) {
  return (
    <Editor
      {...props}
      defaultLanguage="typescript"
      onChange={onChange}
      onMount={onMount}
      options={options}
      theme={theme}
      value={value}
      {...props}
    />
  );
}
