'use client';
import clsx from 'clsx';
import React, { useCallback, useEffect, useState } from 'react';
import { useMonaco, type OnValidate, type OnMount, type OnChange } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { CodeEditor } from './code-editor';
import { libSource } from './editor-types';

export interface SplitEditorProps extends Omit<React.HTMLProps<HTMLDivElement>, 'onChange'> {
  tests: string;
  challenge: string;
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
}

export default function SplitEditor({
  className,
  tests,
  challenge,
  onMount,
  onValidate,
  onChange,
}: SplitEditorProps) {
  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      const libUri = monaco.Uri.parse('file:///asserts.d.ts');

      monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);

      if (!monaco.editor.getModel(libUri)) {
        monaco.languages.typescript.javascriptDefaults.addExtraLib(
          libSource,
          'file:///asserts.d.ts',
        );
        monaco.editor
          .createModel(libSource, 'typescript', libUri)
          .setEOL(monaco.editor.EndOfLineSequence.LF);
      }
    }
  }, [monaco]);

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
            onMount={onMount?.tests}
            defaultPath="file:///tests.ts"
            value={tests}
            defaultValue={tests}
            onChange={onChange?.tests}
            onValidate={onValidate?.tests}
          />
        </header>
      ) : null}
      <section className="flex-shrink flex-grow">
        <CodeEditor
          defaultPath="file:///user.ts"
          onMount={onMount?.user}
          defaultValue={challenge}
          value={challenge}
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
                  let f: editor.IMarkerData;
                  return {
                    severity: monaco.MarkerSeverity.Error,
                    startLineNumber: start.lineNumber,
                    endLineNumber: end.lineNumber,
                    startColumn: start.column,
                    endColumn: end.column,
                    message: d.messageText,
                  } as editor.IMarkerData;
                });

                monaco.editor.setModelMarkers(model, model.getLanguageId(), markers);
              }
            }
            onChange?.user && onChange.user(e, a);
          }}
        />
      </section>
    </div>
  );
}
