'use client';

import { loader } from '@monaco-editor/react';
import clsx from 'clsx';
import { Loader2, Settings } from 'lucide-react';
import type * as monaco from 'monaco-editor';
import { useSession } from '@repo/auth/react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRef, useState } from 'react';
import lzstring from 'lz-string';
import { saveSubmission } from '../save-submission.action';
import { SettingsForm } from '../settings-form';
import { USER_CODE_START, USER_CODE_START_REGEX } from './constants';
import { libSource } from './editor-types';
import { createTwoslashInlayProvider } from './twoslash';
import { type ChallengeRouteData } from '~/app/challenge/[id]/getChallengeRouteData';
import { Button } from '~/components/ui/button';
import { CodeEditor } from '~/components/ui/code-editor';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { ToastAction } from '~/components/ui/toast';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';
import { useToast } from '~/components/ui/use-toast';
import { useLocalStorage } from '~/utils/useLocalStorage';

const VimStatusBar = dynamic(() => import('./vimMode').then((v) => v.VimStatusBar), {
  ssr: false,
});

loader.config({
  paths: {
    vs: '/vs',
  },
});

export const LIB_URI = 'ts:filename/checking.d.ts';

interface Props {
  challenge: ChallengeRouteData;
}

export type TsErrors = [
  SemanticDiagnostics: monaco.languages.typescript.Diagnostic[],
  SyntacticDiagnostics: monaco.languages.typescript.Diagnostic[],
  SuggestionDiagnostics: monaco.languages.typescript.Diagnostic[],
  CompilerOptionsDiagnostics: monaco.languages.typescript.Diagnostic[],
];

export function CodePanel(props: Props) {
  const params = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const [tsErrors, setTsErrors] = useState<TsErrors>([[], [], [], []]);
  const [initialTypecheckDone, setInitialTypecheckDone] = useState(false);
  const [localStorageCode, setLocalStorageCode] = useLocalStorage(
    `challenge-${props.challenge.id}`,
    '',
  );

  const defaultCode =
    lzstring.decompressFromEncodedURIComponent(params.get('code') ?? '') ?? localStorageCode;

  const getDefaultCode = () => {
    if (!defaultCode) {
      return props.challenge.prompt;
    }

    console.log({ defaultCode });

    const [appendSolutionToThis, separator] = props.challenge.prompt.split(USER_CODE_START_REGEX);

    return `${appendSolutionToThis ?? ''}${separator ?? ''}${defaultCode}`;
  };

  const [code, setCode] = useState(() => getDefaultCode());

  const modelRef = useRef<monaco.editor.ITextModel>();
  // ref doesnt cause a rerender
  const [editorState, setEditorState] = useState<monaco.editor.IStandaloneCodeEditor>();

  const handleSubmit = async () => {
    const [, solution] = code.split(USER_CODE_START);
    const hasErrors = tsErrors.some((e) => e.length);

    await saveSubmission(props.challenge.id, session?.user.id!, solution ?? '', !hasErrors);
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
        action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
      });
    }
  };

  const onMount =
    (value: string, onError: (v: TsErrors) => void) =>
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    async (editor: monaco.editor.IStandaloneCodeEditor, monaco: typeof import('monaco-editor')) => {
      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        ...monaco.languages.typescript.typescriptDefaults.getCompilerOptions(),
        strict: true,
        target: monaco.languages.typescript.ScriptTarget.ESNext,
        strictNullChecks: true,
      });

      if (!monaco.editor.getModel(monaco.Uri.parse(LIB_URI))) {
        monaco.languages.typescript.javascriptDefaults.addExtraLib(libSource, LIB_URI);
        monaco.editor.createModel(libSource, 'typescript', monaco.Uri.parse(LIB_URI));
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
            <Tooltip>
              <TooltipTrigger asChild>
                <Settings className="stroke-zinc-500 stroke-1 hover:stroke-zinc-400" size={20} />
              </TooltipTrigger>
              <TooltipContent className="px-2 py-1">Settings</TooltipContent>
            </Tooltip>
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
        <CodeEditor
          onChange={(code) => {
            setCode(code ?? '');
            // we we only want to save whats after the comment
            const [, , storeThiseCode] = (code ?? '').split(USER_CODE_START_REGEX);
            setLocalStorageCode(storeThiseCode ?? '');
          }}
          onMount={onMount(code, setTsErrors)}
          value={code}
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
        {editorState ? <VimStatusBar editor={editorState} /> : null}
        <div className="flex items-center justify-center gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                disabled={!initialTypecheckDone || !session?.user}
                size="sm"
                className="cursor-pointer rounded-lg bg-emerald-600 duration-300 hover:bg-emerald-500 dark:bg-emerald-400 dark:hover:bg-emerald-300"
                onClick={handleSubmit}
              >
                {!initialTypecheckDone && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Login to Submit</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </>
  );
}
