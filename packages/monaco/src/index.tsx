'use client';

import { useMonaco } from '@monaco-editor/react';
import clsx from 'clsx';
import { Loader2 } from '@repo/ui/icons';
import type * as monaco from 'monaco-editor';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useRef, useState } from 'react';
import lzstring from 'lz-string';
import { Button, ToastAction, useToast, Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui';
import { useLocalStorage } from './useLocalStorage';
import SplitEditor, { TESTS_PATH } from './split-editor';
import { createTwoslashInlayProvider } from './twoslash';

const VimStatusBar = dynamic(() => import('./vim-mode').then((v) => v.VimStatusBar), {
  ssr: false,
});

export interface CodePanelProps {
  challenge: {
    id: number;
    code: string;
    tests: string;
  };
  saveSubmission: (code: string, isSuccessful: boolean) => Promise<void>;
  submissionDisabled: boolean;
  settingsElement: React.ReactNode;
}

export type TsErrors = [
  SemanticDiagnostics: monaco.languages.typescript.Diagnostic[],
  SyntacticDiagnostics: monaco.languages.typescript.Diagnostic[],
  SuggestionDiagnostics: monaco.languages.typescript.Diagnostic[],
  CompilerOptionsDiagnostics: monaco.languages.typescript.Diagnostic[],
];

export function CodePanel(props: CodePanelProps) {
  const params = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [tsErrors, setTsErrors] = useState<TsErrors | undefined>(undefined);
  const [localStorageCode, setLocalStorageCode] = useLocalStorage(
    `challenge-${props.challenge.id}`,
    '',
  );

  const initialTypecheckDone = tsErrors === undefined;

  const defaultCode =
    lzstring.decompressFromEncodedURIComponent(params.get('code') ?? '') ?? localStorageCode;

  const getDefaultCode = () => {
    if (!defaultCode) {
      return props.challenge.code;
    }

    return defaultCode;
  };

  const [code, setCode] = useState(() => getDefaultCode());

  const [testEditorState, setTestEditorState] = useState<monaco.editor.IStandaloneCodeEditor>();
  const [userEditorState, setUserEditorState] = useState<monaco.editor.IStandaloneCodeEditor>();

  const handleSubmit = async () => {
    const hasErrors = tsErrors?.some((e) => e.length) ?? false;

    await props.saveSubmission(code ?? '', !hasErrors);
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

  const monacoInstance = useMonaco();

  return (
    <>
      <div className="sticky top-0 flex h-[40px] flex-row-reverse items-center border-b border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-[#1e1e1e]">
        {props.settingsElement}
      </div>
      <div className="w-full flex-1">
        <SplitEditor
          tests={props.challenge.tests}
          userCode={code}
          onMount={{
            tests: (editor) => {
              setTestEditorState(editor);
            },
            user: async (editor, monaco) => {
              monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
                ...monaco.languages.typescript.typescriptDefaults.getCompilerOptions(),
                strict: true,
                target: monaco.languages.typescript.ScriptTarget.ESNext,
                strictNullChecks: true,
              });

              setUserEditorState(editor);

              const model = editor.getModel();

              if (!model) {
                throw new Error();
              }

              const ts = await (await monaco.languages.typescript.getTypeScriptWorker())(model.uri);

              monaco.languages.registerInlayHintsProvider(
                'typescript',
                createTwoslashInlayProvider(monaco, ts),
              );
            },
          }}
          onChange={{
            user: async (code) => {
              if (!monacoInstance) return null;
              setCode(code ?? '');
              setLocalStorageCode(code ?? '');
              const getTsWorker = await monacoInstance.languages.typescript.getTypeScriptWorker();

              const mm = monacoInstance.editor.getModel(monacoInstance.Uri.parse(TESTS_PATH));
              if (!mm) return null;

              const tsWorker = await getTsWorker(mm.uri);

              const errors = await Promise.all([
                tsWorker.getSemanticDiagnostics(TESTS_PATH),
                tsWorker.getSyntacticDiagnostics(TESTS_PATH),
                Promise.resolve([]),
                tsWorker.getCompilerOptionsDiagnostics(TESTS_PATH),
              ] as const);

              setTsErrors(errors);
            },
          }}
        />
      </div>
      <div
        className={clsx(
          {
            'justify-between': testEditorState,
          },
          'sticky bottom-0 flex items-center justify-end p-2 dark:bg-[#1e1e1e]',
        )}
      >
        {userEditorState && <VimStatusBar editor={userEditorState} />}
        <div className="flex items-center justify-center gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                disabled={!initialTypecheckDone || props.submissionDisabled}
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
