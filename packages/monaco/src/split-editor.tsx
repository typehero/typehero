'use client';
import clsx from 'clsx';
import React, { useCallback, useEffect, useState } from 'react';
import { useMonaco, type OnValidate, type OnMount, type OnChange } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { CodeEditor, LIB_URI } from './code-editor';
import { libSource } from './editor-types';

export const TESTS_PATH = 'file:///tests.ts';
export const USER_CODE_PATH = 'file:///user.ts';

export interface SplitEditorProps {
  /** the classes applied to the container div */
  className?: string;
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
  onlyTests?: boolean;
  monacoInstance: typeof import('monaco-editor') | undefined;
}

export default function SplitEditor({
  className,
  tests,
  userCode,
  onMount,
  onValidate,
  onChange,
  monacoInstance,
}: SplitEditorProps) {
  useEffect(() => {
    if (monacoInstance) {
      const libUri = monacoInstance.Uri.parse(LIB_URI);

      monacoInstance.languages.typescript.typescriptDefaults.setEagerModelSync(true);

      if (!monacoInstance.editor.getModel(libUri)) {
        monacoInstance.languages.typescript.javascriptDefaults.addExtraLib(libSource, LIB_URI);
        monacoInstance.editor
          .createModel(libSource, 'typescript', libUri)
          .setEOL(monacoInstance.editor.EndOfLineSequence.LF);
      }
    }
  }, [monacoInstance]);

  const [footerExpanded, setFooterExpanded] = useState(false);

  return (
    <div className={clsx('flex h-full flex-col gap-2', className)}>
      <button onClick={() => setFooterExpanded(!footerExpanded)}>
        {footerExpanded ? 'hide' : 'show'} all
      </button>
      {footerExpanded ? (
        <header
          className={clsx('flex-shrink-0 overflow-hidden transition-all', {
            'min-h-[30vh]': footerExpanded,
            'min-h-0': !footerExpanded,
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
            if (monacoInstance) {
              const models = monacoInstance.editor.getModels();
              const getWorker = await monacoInstance.languages.typescript.getTypeScriptWorker();

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
                    severity: monacoInstance.MarkerSeverity.Error,
                    startLineNumber: start.lineNumber,
                    endLineNumber: end.lineNumber,
                    startColumn: start.column,
                    endColumn: end.column,
                    message: d.messageText as string,
                  } satisfies editor.IMarkerData;
                });

                monacoInstance.editor.setModelMarkers(model, model.getLanguageId(), markers);
              }
            }

            onChange?.user?.(e, a);
          }}
        />
      </section>
    </div>
  );
}
