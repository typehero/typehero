'use client';

import { type OnChange, type OnMount, type OnValidate } from '@monaco-editor/react';
import clsx from 'clsx';
import type * as monaco from 'monaco-editor';
import { useEffect, useRef } from 'react';
import { CodeEditor, LIB_URI } from './code-editor';
import { libSource } from './editor-types';
import dynamic from 'next/dynamic';
import { useEditorSettingsStore } from './settings-store';
import { getEventDeltas } from './utils';

function preventSelection(event: Event) {
  event.preventDefault();
}

const VimStatusBar = dynamic(() => import('./vim-mode'), {
  ssr: false,
});

const MIN_HEIGHT = 150;
const COLLAPSE_THRESHOLD = MIN_HEIGHT / 2;

export const TESTS_PATH = 'file:///tests.ts';
export const USER_CODE_PATH = 'file:///user.ts';

export interface SplitEditorProps {
  /** the classes applied to the container div */
  className?: string;
  expandTestPanel: boolean;
  setIsTestPanelExpanded: (isExpanded: boolean) => void;
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
  setIsTestPanelExpanded,
  tests,
  userCode,
  onMount,
  onValidate,
  onChange,
  monaco,
}: SplitEditorProps) {
  const { settings, updateSettings } = useEditorSettingsStore();

  const wrapper = useRef<HTMLDivElement>(null);
  const resizer = useRef<HTMLDivElement>(null);
  const testPanel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resizerRef = resizer.current;
    const testPanelRef = testPanel.current;
    const wrapperRef = wrapper.current;

    if (!resizerRef || !testPanelRef || !wrapperRef) {
      return;
    }

    let y = 0;
    let initialHeight = testPanelRef.offsetHeight;

    const mouseMoveHandler = (e: MouseEvent | TouchEvent) => {
      // Remove transition during drag because of performance issues
      if (testPanelRef.classList.contains('transition-all')) {
        testPanelRef.classList.remove('transition-all');
      }

      document.body.style.setProperty('cursor', 'row-resize');

      const { dy } = getEventDeltas(e, { x: 0, y });

      const height = initialHeight - dy;

      if (height >= MIN_HEIGHT) {
        testPanelRef.style.height = `${Math.min(height, wrapperRef.offsetHeight)}px`;
        setIsTestPanelExpanded(true);
      } else if (height < COLLAPSE_THRESHOLD) {
        setIsTestPanelExpanded(false);
      }
    };

    const mouseDownHandler = (e: MouseEvent | TouchEvent) => {
      initialHeight = testPanelRef.offsetHeight;

      if (e instanceof MouseEvent) {
        y = e.clientY;
      } else if (e instanceof TouchEvent) {
        y = e.touches[0]?.clientY ?? 0;
      }

      if (e instanceof MouseEvent) {
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
      } else if (e instanceof TouchEvent) {
        document.addEventListener('touchmove', mouseMoveHandler);
        document.addEventListener('touchend', mouseUpHandler);
      }

      // Prevent selection during drag
      document.addEventListener('selectstart', preventSelection);
    };

    const mouseUpHandler = function () {
      // Restore transition
      testPanelRef.classList.add('transition-all');

      document.body.style.removeProperty('cursor');

      document.removeEventListener('touchmove', mouseMoveHandler);
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('touchend', mouseUpHandler);
      document.removeEventListener('mouseup', mouseUpHandler);

      // Restore selection
      document.removeEventListener('selectstart', preventSelection);

      updateSettings({
        ...settings,
        testPanelHeight:
          testPanelRef.offsetHeight < MIN_HEIGHT ? MIN_HEIGHT : testPanelRef.offsetHeight,
      });
    };

    const resizeHandler = () => {
      if (testPanelRef.offsetHeight >= MIN_HEIGHT) {
        testPanelRef.style.height = `${Math.min(
          testPanelRef.offsetHeight,
          wrapperRef.offsetHeight,
        )}px`;
        setIsTestPanelExpanded(true);
      } else {
        setIsTestPanelExpanded(false);
      }
    };

    window.addEventListener('resize', resizeHandler);
    resizerRef.addEventListener('mousedown', mouseDownHandler);
    resizerRef.addEventListener('touchstart', mouseDownHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
      resizerRef.removeEventListener('mousedown', mouseDownHandler);
      resizerRef.removeEventListener('touchstart', mouseDownHandler);
    };
  }, [settings, updateSettings, setIsTestPanelExpanded]);

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
    <div className={clsx('flex h-[calc(100%-_90px)] flex-col', className)} ref={wrapper}>
      <section className="h-full overflow-hidden">
        <CodeEditor
          className="overflow-hidden"
          height={userEditorState && settings.bindings === 'vim' ? 'calc(100% - 36px)' : '100%'}
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
        {userEditorState && settings.bindings === 'vim' && (
          <VimStatusBar editor={userEditorState} />
        )}
      </section>
      <div
        className="transition-all"
        style={{
          height: `${expandTestPanel ? settings.testPanelHeight || MIN_HEIGHT : 0}px`,
        }}
        ref={testPanel}
      >
        <div
          className="cursor-row-resize border-y border-zinc-300 bg-zinc-800 p-2 dark:border-zinc-700"
          ref={resizer}
        >
          <div className="m-auto h-1 w-24 rounded-full bg-zinc-700" />
        </div>
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
