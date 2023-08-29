'use client';
import { useMonaco, type OnChange, type OnMount, type OnValidate } from '@monaco-editor/react';
import clsx from 'clsx';
import type { editor } from 'monaco-editor';
import { useEffect, useState } from 'react';
import { CodeEditor, LIB_URI } from './code-editor';
import { libSource } from './editor-types';

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
}

// million-ignore
export default function SplitEditor({
  className,
  expandTestPanel,
  tests,
  userCode,
  onMount,
  onValidate,
  onChange,
  monaco,
}: SplitEditorProps) {
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
    <div className={clsx('flex h-full flex-col gap-2', className)}>
      {expandTestPanel ? (
        <header
          className={clsx('flex-shrink-0 overflow-hidden transition-all', {
            'min-h-[30vh]': expandTestPanel,
            'min-h-0': !expandTestPanel,
          })}
        >
          <CodeEditor
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
        </header>
      ) : null}
      <section className="flex-shrink flex-grow">
        <CodeEditor
          defaultPath={USER_CODE_PATH}
          onMount={onMount?.user}
          defaultValue={userCode}
          value={userCode}
          onValidate={onValidate?.user}
          onChange={async (e, a) => {
            // Most of this shamelessly stolen from Stackoverflow.
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
                  } satisfies editor.IMarkerData;
                });

                monaco.editor.setModelMarkers(model, model.getLanguageId(), markers);
              }
            }

            onChange?.user?.(e, a);
          }}
        />
      </section>
    </div>
  );
}
