'use client';

import Editor from '@monaco-editor/react';
import clsx from 'clsx';
import { Loader2, Settings } from 'lucide-react';
import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { useSession } from 'next-auth/react';
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { useToast } from '~/components/ui/use-toast';
import type { Challenge } from '..';
import { saveSubmission } from '../save-submission';
import { SettingsForm } from '../settings-form';
import { useEditorSettingsStore } from '../settings-store';
import { USER_CODE_START } from './constants';
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
  challenge: NonNullable<Challenge>;
}

const libCache = new Set<string>();
export const CodePanel = ({ challenge }: Props) => {
  const { toast } = useToast();
  const { theme } = useTheme();
  const { data: session } = useSession();
  const { settings } = useEditorSettingsStore();
  const [hasErrors, setHasErrors] = useState(false);
  const [initialTypecheckDone, setInitialTypecheckDone] = useState(false);

  const defaultCode = useMemo(() => {
    // if a user has an existing solution use that instead of prompt
    const usersExistingSolution = challenge.Solution?.[0];

    if (!usersExistingSolution) {
      return challenge.prompt;
    }

    const [appendSolutionToThis, separator] = (challenge.prompt as string).split(
      /(\/\/ CODE START)/g,
    );
    const parsedUserSolution = JSON.parse(usersExistingSolution?.code as string) as string;

    return `${appendSolutionToThis ?? ''}${separator ?? ''}${parsedUserSolution}`;
  }, [challenge.Solution, challenge.prompt]);
  const [code, setCode] = useState(defaultCode as string);

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

  const handleSubmit = async () => {
    const [, solution] = code.split(USER_CODE_START);

    if (hasErrors) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! You still have errors.',
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } else {
      await saveSubmission(
        challenge?.id,
        session?.user?.id as string,
        JSON.stringify(solution) ?? '',
      );
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
      const lineWithUserCode = value
        .split('\n')
        .findIndex((line) => line.includes(USER_CODE_START));

      // once you register a lib you cant unregister it (idk how to unregister it)
      // so when editor mounts again it tries to add the lib again and throws an error
      if (!libCache.has(libSource)) {
        monaco.languages.typescript.javascriptDefaults.addExtraLib(libSource, LIB_URI);
        monaco.editor.createModel(libSource, 'typescript', monaco.Uri.parse(LIB_URI));
        libCache.add(libSource);
      }

      const model = editor.getModel();

      if (!model) {
        throw new Error();
      }

      modelRef.current = model;
      setEditorState(editor);

      const ts = await (await monaco.languages.typescript.getTypeScriptWorker())(model.uri);

      const filename = model.uri.toString();

      // what actually runs when checking errors
      const typeCheck = async () => {
        const errors = await Promise.all([
          ts.getSemanticDiagnostics(filename),
          ts.getSyntacticDiagnostics(filename),
          ts.getSuggestionDiagnostics(filename),
          ts.getCompilerOptionsDiagnostics(filename),
        ] as const);

        const hasErrors = errors.some((e) => e.length);

        onError(hasErrors);
      };

      // TODO: we prolly should use this for blocking ranges as it might not be as janky
      // https://github.com/Pranomvignesh/constrained-editor-plugin
      model.onDidChangeContent((e) => {
        // in monaco editor, the first line is e1e1e
        // do net let them type if they are editing before lineWithUserCode
        if (e.changes.some((c) => c.range.startLineNumber <= lineWithUserCode + 1)) {
          editor.trigger('someIdString', 'undo', null);
        }

        typeCheck().catch(console.error);
      });

      await typeCheck();
      setInitialTypecheckDone(true);

      monaco.languages.registerInlayHintsProvider(
        'typescript',
        createTwoslashInlayProvider(monaco, ts),
      );
    };

  return (
    <>
      <div className="sticky top-0 flex h-[40px] flex-row-reverse items-center border-b border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-[#1e1e1e]">
        <Dialog>
          <DialogTrigger>
            <Settings size={20} className="stroke-zinc-500 stroke-1 hover:stroke-zinc-400" />
          </DialogTrigger>
          <DialogContent className="w-[200px]">
            <DialogHeader>
              <DialogTitle>Settings</DialogTitle>
              <div className="pt-4">
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
          onMount={onMount(code, setHasErrors)}
          value={code}
          onChange={(code) => setCode(code ?? '')}
        />
      </div>
      <div
        className={clsx(
          {
            'justify-between': editorState,
          },
          'sticky bottom-0 flex items-center justify-end p-2 dark:bg-[#1e1e1e]',
        )}
      >
        {editorState && <VimStatusBar editor={editorState} />}
        <TooltipProvider>
          <Tooltip delayDuration={0.05} open={session?.user?.id ? false : undefined}>
            <TooltipTrigger asChild>
              <span>
                <Button
                  size="sm"
                  className="bg-emerald-600 duration-300 hover:bg-emerald-500 dark:bg-emerald-300 dark:hover:bg-emerald-400"
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onClick={handleSubmit}
                  disabled={!initialTypecheckDone || !session?.user}
                >
                  {!initialTypecheckDone && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Login to Submit</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </>
  );
};

CodePanel.displayName = 'CodePanel' as const;
