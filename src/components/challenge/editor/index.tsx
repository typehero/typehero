'use client';
import Editor from '@monaco-editor/react';
import { Settings } from 'lucide-react';
import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { useTheme } from 'next-themes';
import { useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { SettingsForm } from '../settings-form';
import { useEditorSettingsStore } from '../settings-store';
import { createTwoslashInlayProvider } from './twoslash';
import { VimStatusBar, loadVim } from './vimMode';

declare global {
  // eslint-disable-next-line no-var
  var editor: monaco.editor.IStandaloneCodeEditor;
  // eslint-disable-next-line no-var
  var model: monaco.editor.ITextModel;
}

const defaultOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
  lineNumbers: 'off',
  tabSize: 2,
  insertSpaces: false,
  minimap: {
    enabled: false,
  },
  fontSize: 16,
};

type Monaco = typeof monaco;

/// based on: https://github.com/type-challenges/type-challenges/blob/main/utils/index.d.ts
const libSource = `
type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? true : false

type MergeInsertions<T> =
  T extends object
    ? { [K in keyof T]: MergeInsertions<T[K]> }
    : T

type Alike<X, Y> = Equal<MergeInsertions<X>, MergeInsertions<Y>>

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never

type NoInfer<T> = [T][T extends any ? T : never];

type IsUnion<T, U = T> = [T] extends [never]
	? false
	: T extends unknown
	? [U] extends [T]
		? false
		: true
	: false;


/** 
 * Helper function to test your code.
 * 
 * Checks if two types have all the same properties and modifiers
 * 
 * To check what it is failing, you can hover over \`Equal\` and see what the types failing are
 */
function Equal<A, B>(...args: Alike<A, B> extends true ? [] : [msg: "not equal"]): void;

/** 
 * Helper function to test your code.
 * 
 * Checks if type \`A\` extends \`B\`
 * 
 * To check what it is failing, you can hover over \`Extends\` and see what the types failing are
 */
function Extends<A, B>(...args: A extends B ? [] : [msg: [A, "doesn't extend", B]]): void;
`;

const libUri = 'ts:filename/checking.d.ts';

const onMount =
  (value: string) => async (editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => {
    const numLines = value.split('\n').length;
    const lastLineLength = value.split('\n').at(-1)?.length || 1;

    monaco.languages.typescript.javascriptDefaults.addExtraLib(libSource, libUri);
    monaco.editor.createModel(libSource, 'typescript', monaco.Uri.parse(libUri));

    const model = editor.getModel();

    if (!model) {
      throw new Error();
    }

    globalThis.model = model;
    globalThis.editor = editor;

    loadVim(editor);

    const ts = await (await monaco.languages.typescript.getTypeScriptWorker())(model.uri);

    const filename = model.uri.toString();

    // what actually runs when checking errors
    const _runCommand = async () => {
      const errors = await Promise.all([
        ts.getSemanticDiagnostics(filename),
        ts.getSyntacticDiagnostics(filename),
        ts.getSuggestionDiagnostics(filename),
        ts.getCompilerOptionsDiagnostics(filename),
      ] as const);

      console.log(errors);
    };

    let fixingStart = false;

    model.onDidChangeContent((e) => {
      if (
        e.changes.some(
          (c) =>
            c.range.startLineNumber < numLines ||
            (c.range.startLineNumber === numLines && c.range.startColumn <= lastLineLength),
        )
      ) {
        if (!fixingStart && !e.isUndoing && !e.isRedoing) {
          editor.trigger('someIdString', e.isUndoing ? 'redo' : 'undo', null);
        }

        fixingStart = !fixingStart;
      }
    });

    monaco.languages.registerInlayHintsProvider(
      'typescript',
      createTwoslashInlayProvider(monaco, ts),
    );
  };

interface Props {
  prompt: string;
}
export const CodePanel = ({ prompt }: Props) => {
  const { theme } = useTheme();

  const { settings } = useEditorSettingsStore();
  const editorTheme = theme === 'light' ? 'vs' : 'vs-dark';
  const editorOptions = useMemo(() => {
    const options = {
      ...defaultOptions,
      ...settings,
      fontSize: parseInt(settings.fontSize),
      tabSize: parseInt(settings.tabSize),
    };
    return {
      ...options,
    };
  }, [settings]);

  return (
    <>
      <div className="container flex items-end space-y-2 bg-muted py-4">
        <div className="ml-auto flex w-full space-x-2 sm:justify-end">
          <Dialog>
            <DialogTrigger>
              <Settings />
            </DialogTrigger>
            <DialogContent className="w-[200px]">
              <DialogHeader>
                <DialogTitle>Settings</DialogTitle>
                <div className="py-4">
                  <SettingsForm />
                </div>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Editor
        theme={editorTheme}
        options={editorOptions}
        defaultLanguage="typescript"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onMount={onMount(prompt)}
        defaultValue={prompt}
        className="flex-1"
      />
      <VimStatusBar />
    </>
  );
};

CodePanel.displayName = 'CodePanel' as const;
