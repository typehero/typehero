'use client';

import { type OnChange, type OnMount, type OnValidate } from '@monaco-editor/react';
import clsx from 'clsx';
import type * as monaco from 'monaco-editor';
import { useEffect } from 'react';
import { CodeEditor, LIB_URI } from './code-editor';
import { libSource } from './editor-types';
import dynamic from 'next/dynamic';
import { useEditorSettingsStore } from './settings-store';

const VimStatusBar = dynamic(() => import('./vim-mode'), {
  ssr: false,
});

export const TESTS_PATH = 'file:///tests.ts';
export const USER_CODE_PATH = 'file:///user.ts';

export interface SplitEditorProps {
  /** the classes applied to the container div */
  className?: string;
  expandTestPanel: boolean;
  tests: string;
  userCode: string;
  onValidate?: {
    tests?: OnValidate;
    user?: OnValidate;
  };
  onMount?: {
    tests?: OnMount;
    user?: OnMount;
  };
  onChange?: {
    tests?: OnChange;
    user?: OnChange;
  };
  monaco: typeof import('monaco-editor') | undefined;
  userEditorState?: monaco.editor.IStandaloneCodeEditor;
}

// million-ignore
export default function SplitEditor({
  className,
  userEditorState,
  expandTestPanel,
  tests,
  userCode,
  onMount,
  onValidate,
  onChange,
  monaco,
}: SplitEditorProps) {
  const { settings } = useEditorSettingsStore();
  useEffect(() => {
    if (monaco) {
      const libUri = monaco.Uri.parse(LIB_URI);

      monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);

      if (!monaco.editor.getModel(libUri)) {
        monaco.languages.typescript.javascriptDefaults.addExtraLib(libSource, LIB_URI);
        monaco.editor
          .createModel(libSource, 'typescript', libUri)
          .setEOL(monaco.editor.EndOfLineSequence.LF);
      }
    }
  }, [monaco]);

  return (
    <div className={clsx('flex h-[calc(100%-_90px)] flex-col', className)}>
      <section className="min-h-0 flex-grow">
        <CodeEditor
          defaultPath={USER_CODE_PATH}
          onMount={onMount?.user}
          defaultValue={userCode}
          value={userCode}
          onValidate={onValidate?.user}
          onChange={async (e, a) => {
            if (monaco) {
              const models = monaco.editor.getModels();
              const getWorker = await monaco.languages.typescript.getTypeScriptWorker();

              for (const model of models) {
                const worker = await getWorker(model.uri);
                const diagnostics = (
                  await Promise.all([
                    worker.getSyntacticDiagnostics(model.uri.toString()),
                    worker.getSemanticDiagnostics(model.uri.toString()),
                  ])
                ).reduce((a, b) => a.concat(b));

                const markers = diagnostics.map((d) => {
                  const start = model.getPositionAt(d.start!);
                  const end = model.getPositionAt(d.start! + d.length!);

                  return {
                    severity: monaco.MarkerSeverity.Error,
                    startLineNumber: start.lineNumber,
                    endLineNumber: end.lineNumber,
                    startColumn: start.column,
                    endColumn: end.column,
                    message: d.messageText as string,
                  } satisfies monaco.editor.IMarkerData;
                });

                monaco.editor.setModelMarkers(model, model.getLanguageId(), markers);
              }
            }

            onChange?.user?.(e, a);
          }}
        />
      </section>
      {userEditorState && settings.bindings === 'vim' && <VimStatusBar editor={userEditorState} />}
      <div
        className={clsx('transition-all', {
          'h-[30vh] border-t border-zinc-300 dark:border-zinc-700': expandTestPanel,
          hidden: !expandTestPanel,
        })}
      >
        <CodeEditor
          options={{
            lineNumbers: 'off',
          }}
          onMount={(editor, monaco) => {
            editor.updateOptions({
              readOnly: true,
              renderValidationDecorations: 'on',
            });

            onMount?.tests?.(editor, monaco);
          }}
          defaultPath={TESTS_PATH}
          value={tests}
          defaultValue={tests}
          onChange={onChange?.tests}
          onValidate={onValidate?.tests}
        />
      </div>
    </div>
  );
}
