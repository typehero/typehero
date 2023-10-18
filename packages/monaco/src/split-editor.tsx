'use client';
import { createTwoslashInlayProvider } from './twoslash';

import { type OnChange, type OnMount, type OnValidate } from '@monaco-editor/react';
import { setupTypeAcquisition } from '@typescript/ata';
import clsx from 'clsx';
import debounce from 'lodash/debounce';
import type * as monacoType from 'monaco-editor';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import ts from 'typescript';
import { CodeEditor, LIB_URI } from './code-editor';
import { useResetEditor } from './editor-hooks';
import { libSource } from './editor-types';
import { PrettierFormatProvider } from './prettier';
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
  userEditorState?: monacoType.editor.IStandaloneCodeEditor;
  isTestsReadonly?: boolean;
}

// million-ignore
export default function SplitEditor({
  className,
  isTestsReadonly = true,
  expandTestPanel,
  monaco,
  onChange,
  onMount,
  onValidate,
  setIsTestPanelExpanded,
  tests,
  userCode,
  userEditorState,
}: SplitEditorProps) {
  const { settings, updateSettings } = useEditorSettingsStore();
  const { subscribe } = useResetEditor();

  const wrapper = useRef<HTMLDivElement>(null);
  const resizer = useRef<HTMLDivElement>(null);
  const testPanel = useRef<HTMLDivElement>(null);
  const monacoRef = useRef<typeof import('monaco-editor')>();

  useEffect(() => {
    monacoRef.current = monaco;
  }, [monaco]);

  // i moved this into onMount to avpid the monacoRef stuff but then you can really debounce it
  const [ata] = useState(() =>
    setupTypeAcquisition({
      projectName: 'TypeHero Playground',
      typescript: ts,
      logger: console,
      delegate: {
        receivedFile: (code: string, _path: string) => {
          if (!monacoRef.current) return;
          const path = `file://${_path}`;
          const uri = monacoRef.current.Uri.parse(path);
          const model = monacoRef.current.editor.getModel(uri);
          if (!model) {
            monacoRef.current.languages.typescript.typescriptDefaults.addExtraLib(code, path);
            monacoRef.current.editor.createModel(code, 'typescript', uri);
          }

          const models = monacoRef.current.editor.getModels();
          for (const m of models) {
            console.log({
              model: m.uri.toString(),
              value: m.getValue(),
            });
          }
        },
      },
    }),
  );

  const debouncedAta = useRef(debounce((code: string) => ata(code), 1000)).current;

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

  subscribe(
    'resetCode',
    () => {
      if (monaco && userEditorState) {
        onMount?.tests?.(userEditorState, monaco);
      }
    },
    [monaco, userEditorState],
  );

  return (
    <div className={clsx('flex h-[calc(100%-_90px)] flex-col', className)} ref={wrapper}>
      <section className="h-full overflow-hidden">
        <CodeEditor
          className="overflow-hidden"
          height={userEditorState && settings.bindings === 'vim' ? 'calc(100% - 36px)' : '100%'}
          defaultPath={USER_CODE_PATH}
          onMount={async (editor, monaco) => {
            const libUri = monaco.Uri.parse(LIB_URI);

            monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);

            if (!monaco.editor.getModel(libUri)) {
              monaco.languages.typescript.javascriptDefaults.addExtraLib(libSource, LIB_URI);
              monaco.editor
                .createModel(libSource, 'typescript', libUri)
                .setEOL(monaco.editor.EndOfLineSequence.LF);
            }

            const model = monaco.editor.getModel(monaco.Uri.parse(USER_CODE_PATH))!;
            debouncedAta(model.getValue());

            editor.getModel()?.onDidChangeContent(() => {
              debouncedAta(editor.getValue());
            });

            const tsWorker = await (
              await monaco.languages.typescript.getTypeScriptWorker()
            )(model.uri);
            monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
              ...monaco.languages.typescript.typescriptDefaults.getCompilerOptions(),
              strict: true,
              target: monaco.languages.typescript.ScriptTarget.ESNext,
              strictNullChecks: true,
              moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
              allowSyntheticDefaultImports: true,
              outDir: 'lib', // kills the override input file error
            });

            monaco.languages.registerDocumentFormattingEditProvider(
              'typescript',
              PrettierFormatProvider,
            );

            monaco.languages.registerInlayHintsProvider(
              'typescript',
              createTwoslashInlayProvider(monaco, tsWorker),
            );

            onMount?.user?.(editor, monaco);
          }}
          defaultValue={userCode}
          value={userCode}
          onValidate={onValidate?.user}
          onChange={async (e, a) => {
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
          className="group cursor-row-resize border-y border-zinc-200 bg-zinc-100 p-2 dark:border-zinc-700 dark:bg-zinc-800"
          ref={resizer}
          onDoubleClick={() => {
            setIsTestPanelExpanded(false);
          }}
        >
          <div className="group-hover:bg-primary group-hover:dark:bg-primary group-active:bg-primary m-auto h-1 w-24 rounded-full bg-zinc-300 duration-300 dark:bg-zinc-700" />
        </div>
        <CodeEditor
          options={{
            lineNumbers: 'off',
          }}
          onMount={(editor, monaco) => {
            editor.updateOptions({
              readOnly: isTestsReadonly,
              renderValidationDecorations: 'on',
            });

            onMount?.tests?.(editor, monaco);
          }}
          defaultPath={TESTS_PATH}
          value={tests}
          defaultValue={tests}
          onChange={async (e, a) => {
            onChange?.tests?.(e, a);
          }}
          onValidate={onValidate?.tests}
        />
      </div>
    </div>
  );
}
