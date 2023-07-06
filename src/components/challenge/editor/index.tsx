'use client';

import Editor from '@monaco-editor/react';
import clsx from 'clsx';
import { Loader2, Settings } from 'lucide-react';
import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
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
import { saveSubmission } from '../save-submission.action';
import { SettingsForm } from '../settings-form';
import { useEditorSettingsStore } from '../settings-store';
import { USER_CODE_START, USER_CODE_START_REGEX } from './constants';
import { libSource } from './editor-types';
import { createTwoslashInlayProvider } from './twoslash';
import { VimStatusBar } from './vimMode';

const DEFAULT_OPTIONS = {
  lineNumbers: 'on',
  tabSize: 2,
  insertSpaces: false,
  minimap: {
    enabled: false,
  },
  fontSize: 16,
} as const satisfies monaco.editor.IStandaloneEditorConstructionOptions;

const LIB_URI = 'ts:filename/checking.d.ts';

type Monaco = typeof monaco;

type Props = (
  | {
      mode: 'solve';
      challenge: Pick<NonNullable<Challenge>, 'Solution' | 'prompt' | 'id'>;
      prompt?: never;
    }
  | {
      mode: 'create';
      challenge?: never;
      onSubmit: (code: string) => void;
      prompt: string | undefined;
    }
  | {
      mode: 'check-created';
      challenge?: never;
      prompt: string;
      onSubmit: () => void;
    }
) & {
  /** @default "Submit" */
  submitText?: string;
  extraButton?: React.ReactNode;
};

type TsErrors = [
  SemanticDiagnostics: monaco.languages.typescript.Diagnostic[],
  SyntacticDiagnostics: monaco.languages.typescript.Diagnostic[],
  SuggestionDiagnostics: monaco.languages.typescript.Diagnostic[],
  CompilerOptionsDiagnostics: monaco.languages.typescript.Diagnostic[],
];

const libCache = new Set<string>();

export const CodePanel = (props: Props) => {
  const router = useRouter();
  const { toast } = useToast();
  const { theme } = useTheme();
  const { data: session } = useSession();
  const { settings } = useEditorSettingsStore();
  const [tsErrors, setTsErrors] = useState<TsErrors>([[], [], [], []]);
  const [initialTypecheckDone, setInitialTypecheckDone] = useState(false);

  // Prisma.JsonValue
  const defaultCode = useMemo(() => {
    if (props.mode !== 'solve') return props.prompt ?? '';

    // if a user has an existing solution use that instead of prompt
    const usersExistingSolution = props.challenge.Solution?.[0];

    if (!usersExistingSolution) {
      return props.challenge.prompt;
    }

    const [appendSolutionToThis, separator] = props.challenge.prompt.split(USER_CODE_START_REGEX);
    const parsedUserSolution = usersExistingSolution?.code;

    return `${appendSolutionToThis ?? ''}${separator ?? ''}${parsedUserSolution}`;
  }, [props.challenge?.Solution, props.challenge?.prompt, props.mode, props.prompt]);

  const [code, setCode] = useState(defaultCode);

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

  const handleSubmit =
    props.mode === 'solve'
      ? async () => {
          const [, solution] = code.split(USER_CODE_START);

          const hasErrors = tsErrors.some((e) => e.length);

          await saveSubmission(
            props.challenge.id,
            session?.user?.id as string,
            solution ?? '',
            !hasErrors,
          );
          router.refresh();

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
        }
      : props.mode === 'create'
      ? () => {
          // check that it has some test cases
          // checks that there is a line that starts with Equal or Extends or NotEqual
          if (!/(?:\n|^)\s*(?:Equal|Extends|NotEqual)</.test(code)) {
            toast({
              variant: 'destructive',
              title: 'You need to have test cases in your challenge',
              action: <ToastAction altText="Try again">Try again</ToastAction>,
            });

            return Promise.resolve();
          }

          const hasErrors = !!tsErrors[0].length;

          if (!hasErrors) {
            toast({
              variant: 'destructive',
              title: 'You need to have failing test cases in your challenge',
              action: <ToastAction altText="Try again">Try again</ToastAction>,
            });

            return Promise.resolve();
          }

          if (!USER_CODE_START_REGEX.test(code)) {
            toast({
              variant: 'destructive',
              title: `You need to have the line \`${USER_CODE_START}\` to signify the non-editable part`,
              action: <ToastAction altText="Try again">Try again</ToastAction>,
            });

            return Promise.resolve();
          }

          props.onSubmit(code);

          return Promise.resolve();
        }
      : props.mode === 'check-created'
      ? () => {
          props.onSubmit();
          return Promise.resolve();
        }
      : () => Promise.reject('not finished');

  const onMount =
    (value: string, onError: (v: TsErrors) => void) =>
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

        onError(errors);
      };

      // TODO: we prolly should use this for blocking ranges as it might not be as janky
      // https://github.com/Pranomvignesh/constrained-editor-plugin
      model.onDidChangeContent((e) => {
        if (props.mode !== 'create') {
          // in monaco editor, the first line is e1e1e
          // do net let them type if they are editing before lineWithUserCode
          if (e.changes.some((c) => c.range.startLineNumber <= lineWithUserCode + 1)) {
            editor.trigger('someIdString', 'undo', null);
          }
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
            </DialogHeader>
            <div className="pt-4">
              <SettingsForm />
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="w-full flex-1">
        <Editor
          theme={editorTheme}
          options={editorOptions}
          defaultLanguage="typescript"
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onMount={onMount(code, setTsErrors)}
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
        <div className="flex items-center justify-center gap-4">
          {props.extraButton}
          <TooltipProvider>
            <Tooltip delayDuration={0.05} open={session?.user?.id ? false : undefined}>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    size="sm"
                    className="cursor-pointer bg-emerald-600 duration-300 hover:bg-emerald-500 dark:bg-emerald-400 dark:hover:bg-emerald-300"
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    onClick={handleSubmit}
                    disabled={!initialTypecheckDone || !session?.user}
                  >
                    {!initialTypecheckDone && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {props.submitText ?? 'Submit'}
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Login to Submit</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </>
  );
};
