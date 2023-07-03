'use client';

import Editor from '@monaco-editor/react';
import { Settings } from 'lucide-react';
import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { useTheme } from 'next-themes';
import { useMemo, useRef, useState } from 'react';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { ToastAction } from '~/components/ui/toast';
import { useToast } from '~/components/ui/use-toast';
import { SettingsForm } from '../settings-form';
import { useEditorSettingsStore } from '../settings-store';
import { libSource } from './editor-types';
import { createTwoslashInlayProvider } from './twoslash';
import { VimStatusBar } from './vimMode';

const DEFAULT_OPTIONS: monaco.editor.IStandaloneEditorConstructionOptions = {
  lineNumbers: 'on',
  tabSize: 2,
  insertSpaces: false,
  minimap: {
    enabled: false,
  },
  fontSize: 16,
} as const;

const LIB_URI = 'ts:filename/checking.d.ts';

type Monaco = typeof monaco;

interface Props {
  prompt: string;
}

export const CodePanel = ({ prompt }: Props) => {
  const { toast } = useToast();
  const { theme } = useTheme();

  const { settings } = useEditorSettingsStore();
  const [hasErrors, setHasErrors] = useState(false);
  const [code, setCode] = useState(prompt);
  const editorTheme = theme === 'light' ? 'vs' : 'vs-dark';
  const modelRef = useRef<monaco.editor.ITextModel>();
  // ref doesnt cause a rerender
  const [editorState, setEditorState] = useState<monaco.editor.IStandaloneCodeEditor>();
  const editorOptions = useMemo(() => {
    const options = {
      ...DEFAULT_OPTIONS,
      ...settings,
      fontSize: parseInt(settings.fontSize),
      tabSize: parseInt(settings.tabSize),
    };
    return {
      ...options,
    };
  }, [settings]);

  const handleSubmit = () => {
    if (hasErrors) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! You still have errors.',
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } else {
      toast({
        variant: 'success',
        title: 'Good job!',
        description: 'You completed this challenge.',
        action: <ToastAction altText="Try again">Dismiss</ToastAction>,
      });
    }
  };

  const onMount =
    (value: string, onError: (v: boolean) => void) =>
    async (editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => {
      const numLines = value.split('\n').length;
      const lastLineLength = value.split('\n').at(-1)?.length || 1;

      monaco.languages.typescript.javascriptDefaults.addExtraLib(libSource, LIB_URI);
      monaco.editor.createModel(libSource, 'typescript', monaco.Uri.parse(LIB_URI));

      const model = editor.getModel();

      if (!model) {
        throw new Error();
      }

      modelRef.current = model;
      setEditorState(editor);

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

        const hasErrors = errors.some((e) => e.length);

        onError(hasErrors);
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

      editor.getModel()?.onDidChangeContent(() => void _runCommand());

      monaco.languages.registerInlayHintsProvider(
        'typescript',
        createTwoslashInlayProvider(monaco, ts),
      );
    };

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-md">
      <div className="container flex h-[40px] flex-row-reverse items-center space-y-2 border border-b-zinc-300 bg-muted dark:border-b-zinc-700">
        <Dialog>
          <DialogTrigger>
            <Settings size={20} className="stroke-gray-500 hover:stroke-gray-400" />
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
      <div className="flex-1">
        <Editor
          theme={editorTheme}
          options={editorOptions}
          defaultLanguage="typescript"
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onMount={onMount(prompt, setHasErrors)}
          value={code}
          onChange={(code) => setCode(code ?? '')}
        />
      </div>
      <div className="flex items-center justify-between bg-muted p-2">
        {editorState && <VimStatusBar editor={editorState} />}
        <Button
          size="sm"
          className="bg-green-300 hover:bg-green-400 dark:hover:bg-green-200"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

CodePanel.displayName = 'CodePanel' as const;
