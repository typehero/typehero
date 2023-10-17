'use client';

import { Button } from '@repo/ui/components/button';
import { ToastAction } from '@repo/ui/components/toast';
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip';
import { useToast } from '@repo/ui/components/use-toast';
import { CheckCircle2, ChevronUp, XCircle } from '@repo/ui/icons';
import clsx from 'clsx';
import lzstring from 'lz-string';
import type * as monaco from 'monaco-editor';
import { usePathname, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { useResetEditor } from './editor-hooks';
import { PrettierFormatProvider } from './prettier';
import SplitEditor, { TESTS_PATH, USER_CODE_PATH } from './split-editor';
import { createTwoslashInlayProvider } from './twoslash';
import { useLocalStorage } from './useLocalStorage';

export interface CodePanelProps {
  challenge: {
    id: number;
    code: string;
    slug: string;
    tests: string;
  };
  saveSubmission: (code: string, isSuccessful: boolean) => Promise<void>;
  submissionDisabled: boolean;
  settingsElement: React.ReactNode;
  updatePlaygroundTestsLocalStorage?: (code: string) => void;
  updatePlaygroundCodeLocalStorage?: (code: string) => void;
}

export type TsErrors = [
  SemanticDiagnostics: monaco.languages.typescript.Diagnostic[],
  SyntacticDiagnostics: monaco.languages.typescript.Diagnostic[],
  CompilerOptionsDiagnostics: monaco.languages.typescript.Diagnostic[],
];

export function CodePanel(props: CodePanelProps) {
  const params = useSearchParams();
  const pathname = usePathname();
  const isPlayground = pathname.includes('playground');
  const { toast } = useToast();
  const [tsErrors, setTsErrors] = useState<TsErrors>();
  const [isTestPanelExpanded, setIsTestPanelExpanded] = useState(false);
  const [localStorageCode, setLocalStorageCode] = useLocalStorage(
    `challenge-${props.challenge.slug}`,
    '',
  );

  const disabled = props.submissionDisabled || tsErrors === undefined;

  const defaultCode =
    lzstring.decompressFromEncodedURIComponent(params.get('code') ?? '') ?? localStorageCode;

  const getDefaultCode = () => {
    if (!defaultCode) {
      return props.challenge.code;
    }

    return defaultCode;
  };

  const [code, setCode] = useState(() => getDefaultCode());
  useResetEditor().subscribe('resetCode', () => {
    setCode(props.challenge.code);
    setLocalStorageCode(props.challenge.code);
  });

  const [testEditorState, setTestEditorState] = useState<monaco.editor.IStandaloneCodeEditor>();
  const [userEditorState, setUserEditorState] = useState<monaco.editor.IStandaloneCodeEditor>();
  const [monacoInstance, setMonacoInstance] = useState<typeof monaco>();

  const handleSubmit = async () => {
    const hasErrors = tsErrors?.some((e) => e.length) ?? false;

    try {
      await props.saveSubmission(code ?? '', !hasErrors);
    } catch {
      return toast({
        variant: 'destructive',
        title: 'Something went wrong while submitting your code.',
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }

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
  const hasFailingTest = tsErrors?.some((e) => e.length) ?? false;

  return (
    <>
      <div className="sticky top-0 flex h-[40px] shrink-0 items-center justify-end gap-4 border-b border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-[#1e1e1e]">
        {props.settingsElement}
      </div>
      <SplitEditor
        isTestsReadonly={!isPlayground}
        userEditorState={userEditorState}
        monaco={monacoInstance}
        expandTestPanel={isTestPanelExpanded}
        setIsTestPanelExpanded={setIsTestPanelExpanded}
        tests={props.challenge.tests}
        userCode={code}
        onMount={{
          tests: async (editor, monaco) => {
            const getTsWorker = await monaco.languages.typescript.getTypeScriptWorker();

            const mm = monaco.editor.getModel(monaco.Uri.parse(TESTS_PATH));
            if (!mm) return null;

            const tsWorker = await getTsWorker(mm.uri);
            const errors = await Promise.all([
              tsWorker.getSemanticDiagnostics(TESTS_PATH),
              tsWorker.getSyntacticDiagnostics(TESTS_PATH),
              tsWorker.getCompilerOptionsDiagnostics(TESTS_PATH),
            ] as const);

            setTsErrors(errors);
            setTestEditorState(editor);
          },
          user: async (editor, monaco) => {
            setMonacoInstance(monaco);

            monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
              ...monaco.languages.typescript.typescriptDefaults.getCompilerOptions(),
              strict: true,
              target: monaco.languages.typescript.ScriptTarget.ESNext,
              strictNullChecks: true,
            });

            monaco.languages.registerDocumentFormattingEditProvider(
              'typescript',
              PrettierFormatProvider,
            );

            setUserEditorState(editor);

            const model = editor.getModel();

            if (!model) {
              throw new Error();
            }

            const ts = await (await monaco.languages.typescript.getTypeScriptWorker())(model.uri);

            const userErrors = await Promise.all([
              ts.getSemanticDiagnostics(USER_CODE_PATH),
              ts.getSyntacticDiagnostics(USER_CODE_PATH),
              ts.getCompilerOptionsDiagnostics(USER_CODE_PATH),
            ] as const);

            const testErrors = await Promise.all([
              ts.getSemanticDiagnostics(TESTS_PATH),
              ts.getSyntacticDiagnostics(TESTS_PATH),
              ts.getCompilerOptionsDiagnostics(TESTS_PATH),
            ] as const);

            setTsErrors(
              testErrors.map((err, i) => {
                return [...err, ...(userErrors[i] || [])];
              }) as TsErrors,
            );

            monaco.languages.registerInlayHintsProvider(
              'typescript',
              createTwoslashInlayProvider(monaco, ts),
            );
          },
        }}
        onChange={{
          tests: (code) => {
            if (isPlayground) {
              props.updatePlaygroundTestsLocalStorage?.(code ?? '');
            }
          },
          user: async (code) => {
            if (!monacoInstance) return null;
            if (isPlayground) {
              props.updatePlaygroundCodeLocalStorage?.(code ?? '');
            }
            setCode(code ?? '');
            setLocalStorageCode(code ?? '');
            const getTsWorker = await monacoInstance.languages.typescript.getTypeScriptWorker();

            const mm = monacoInstance.editor.getModel(monacoInstance.Uri.parse(TESTS_PATH));
            if (!mm) return null;

            const tsWorker = await getTsWorker(mm.uri);

            const testErrors = await Promise.all([
              tsWorker.getSemanticDiagnostics(TESTS_PATH),
              tsWorker.getSyntacticDiagnostics(TESTS_PATH),
              tsWorker.getCompilerOptionsDiagnostics(TESTS_PATH),
            ] as const);

            const userErrors = await Promise.all([
              tsWorker.getSemanticDiagnostics(USER_CODE_PATH),
              tsWorker.getSyntacticDiagnostics(USER_CODE_PATH),
              tsWorker.getCompilerOptionsDiagnostics(USER_CODE_PATH),
            ] as const);

            setTsErrors(
              testErrors.map((err, i) => {
                return [...err, ...(userErrors[i] || [])];
              }) as TsErrors,
            );
          },
        }}
      />
      <div
        className={clsx(
          {
            'justify-between': testEditorState,
          },
          'sticky bottom-0 flex items-center justify-between border-t border-zinc-300 bg-white p-2 dark:border-zinc-700 dark:bg-[#1e1e1e]',
        )}
      >
        <div className="flex items-center gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="flex items-center gap-1"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsTestPanelExpanded((tp) => !tp);
                }}
              >
                Tests
                {isTestPanelExpanded ? (
                  <ChevronUp className="rotate-180 transform transition" size={16} />
                ) : (
                  <ChevronUp className="transform transition" size={16} />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isTestPanelExpanded ? 'Hide tests' : 'Show tests'}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              {hasFailingTest ? (
                <XCircle className="stroke-red-600 dark:stroke-red-300" />
              ) : (
                <CheckCircle2 className="stroke-green-600 dark:stroke-green-300" />
              )}
            </TooltipTrigger>
            <TooltipContent>
              {hasFailingTest ? 'Tests are failing' : 'All tests have passed 🎉'}
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex items-center justify-between gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                disabled={disabled}
                size="sm"
                className="cursor-pointer rounded-lg duration-300"
                onClick={handleSubmit}
              >
                Submit{tsErrors === undefined && ' (open test cases)'}
              </Button>
            </TooltipTrigger>
            {disabled && (
              <TooltipContent>
                <p>Login to Submit</p>
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </div>
    </>
  );
}
