'use client';

import { createTwoslashInlayProvider } from './twoslash';

import { useToast } from '@repo/ui/components/use-toast';
import { setupTypeAcquisition } from '@typescript/ata';
import clsx from 'clsx';
import debounce from 'lodash/debounce';
import lzstring from 'lz-string';
import type * as monacoType from 'monaco-editor';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import ts from 'typescript';
import { CodeEditor } from './code-editor';
import { PrettierFormatProvider } from './prettier';
import { useEditorSettingsStore } from './settings-store';
import { useSearchParams } from 'next/navigation';
import { useLocalStorage } from './useLocalStorage';
import { loader } from '@monaco-editor/react';

const loadTsVersion = async (version: string) => {
  loader.config({
    paths: {
      vs: `https://playgroundcdn.typescriptlang.org/cdn/${version}/monaco/min/vs`,
    },
  });
};

const VimStatusBar = dynamic(() => import('./vim-mode'), {
  ssr: false,
});

export const USER_CODE_PATH = 'file:///user.ts';

export const hasImports = (code: string) => {
  const x = code.split('\n').filter((line) => line.trim().startsWith('import'));
  return x.length > 0;
};

const getActualCode = (code: string) =>
  code
    .split('\n')
    .filter((c) => !c.trim().startsWith('import'))
    .join('\n');

// million-ignore
export function PlaygroundEditor({
  className,
  tsconfig = {},
  tsVersion,
}: {
  className?: string;
  tsconfig?: monacoType.languages.typescript.CompilerOptions;
  tsVersion?: string;
}) {
  const { toast } = useToast();
  const { settings } = useEditorSettingsStore();
  const params = useSearchParams();
  console.log('tsVersion', tsVersion);

  const wrapper = useRef<HTMLDivElement>(null);
  const inlayHintsProviderDisposableRef = useRef<monacoType.IDisposable>();
  const [localStorageCode, setLocalStorageCode] = useLocalStorage('playground', '');
  const [userEditorState, setUserEditorState] = useState<monacoType.editor.IStandaloneCodeEditor>();
  const [monacoInstance, setMonacoInstance] = useState<typeof monacoType>();

  const defaultCode =
    lzstring.decompressFromEncodedURIComponent(params.get('code') ?? '') ?? localStorageCode;

  const [code, setCode] = useState(() => defaultCode);

  useEffect(() => {
    if (tsVersion) {
      console.log('loading ts version', tsVersion);
      loadTsVersion(tsVersion);
    }
  }, [tsVersion]);

  useEffect(() => {
    const saveHandler = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        e.code === 'KeyS' &&
        wrapper.current &&
        wrapper.current.contains(document.activeElement)
      ) {
        e.preventDefault();
        userEditorState?.getAction('editor.action.formatDocument')?.run();
        toast({
          title: 'Saved',
          description: 'Your code has been saved',
          duration: 1000,
          variant: 'success',
        });
      }
    };

    document.addEventListener('keydown', saveHandler);

    return () => {
      document.removeEventListener('keydown', saveHandler);
      inlayHintsProviderDisposableRef.current?.dispose();
    };
  }, [userEditorState]);

  // i moved this into onMount to avoid the monacoRef stuff but then you can really debounce it
  const [ata] = useState(() =>
    setupTypeAcquisition({
      projectName: 'TypeHero Playground',
      typescript: ts,
      logger: console,
      delegate: {
        // NOTE: this gets cached so it wont execute if you comment out an import and uncomment it.
        // it will only be called the first time
        receivedFile: (code: string, _path: string) => {
          if (!monacoInstance || !userEditorState) {
            return;
          }
          const path = `file://${_path}`;
          const uri = monacoInstance.Uri.parse(path);
          const model = monacoInstance.editor.getModel(uri);
          if (!model) {
            monacoInstance.languages.typescript.typescriptDefaults.addExtraLib(code, path);
            monacoInstance.editor.createModel(code, 'typescript', uri);
          }

          const userCode =
            monacoInstance.editor.getModel(monacoInstance.Uri.parse(USER_CODE_PATH))?.getValue() ??
            '';

          if (hasImports(userCode)) {
            monacoInstance.languages.typescript.typescriptDefaults.addExtraLib(
              getActualCode(userCode),
              'file:///node_modules/@types/user.d.ts',
            );
          }
        },
      },
    }),
  );

  const debouncedUserCodeAta = useRef(debounce((code: string) => ata(code), 1000)).current;

  return (
    <div className={clsx('flex h-[calc(100%-_90px)] flex-col', className)} ref={wrapper}>
      <section
        id="code-editor"
        tabIndex={-1}
        className="h-full overflow-hidden focus:border focus:border-blue-500"
      >
        <CodeEditor
          className="overflow-hidden"
          height={userEditorState && settings.bindings === 'vim' ? 'calc(100% - 36px)' : '100%'}
          defaultPath={USER_CODE_PATH}
          onMount={async (editor, monaco) => {
            setMonacoInstance(monaco);
            setUserEditorState(editor);
            typeCheck(monaco);
            monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);

            const model = monaco.editor.getModel(monaco.Uri.parse(USER_CODE_PATH))!;
            const code = model.getValue();
            debouncedUserCodeAta(code);

            monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
              allowNonTsExtensions: true,
              strict: true,
              target: monaco.languages.typescript.ScriptTarget.ESNext,
              strictNullChecks: true,
              moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
              allowSyntheticDefaultImports: true,
              outDir: 'lib', // kills the override input file error
              ...tsconfig,
            });

            monaco.languages.registerDocumentFormattingEditProvider(
              'typescript',
              PrettierFormatProvider,
            );

            const getTsWorker = await monaco.languages.typescript.getTypeScriptWorker();
            const tsWorker = await getTsWorker(model.uri);

            const inlayHintsProviderDisposable = monaco.languages.registerInlayHintsProvider(
              'typescript',
              createTwoslashInlayProvider(monaco, tsWorker),
            );

            inlayHintsProviderDisposableRef.current = inlayHintsProviderDisposable;

            if (hasImports(code)) {
              const actualCode = code
                .split('\n')
                .filter((c) => !c.trim().startsWith('import'))
                .join('\n');
              if (actualCode) {
                monaco.languages.typescript.typescriptDefaults.setExtraLibs([
                  {
                    content: actualCode,
                    filePath: 'file:///node_modules/@types/user.d.ts',
                  },
                ]);
              }
            }
          }}
          defaultValue={code}
          value={code}
          onChange={async (value, changeEvent) => {
            const code = value ?? '';
            debouncedUserCodeAta(code);
            if (hasImports(code)) {
              const actualCode = code
                .split('\n')
                .filter((c) => !c.trim().startsWith('import'))
                .join('\n');
              if (actualCode) {
                monacoInstance?.languages.typescript.typescriptDefaults.setExtraLibs([
                  {
                    content: actualCode,
                    filePath: 'file:///node_modules/@types/user.d.ts',
                  },
                ]);
              }
            } else {
              // we want to blow away the user.d.ts because
              // 1. its no longer needed
              // 2. so you dont get duplicate type errors if you add imports back in
              monacoInstance?.languages.typescript.typescriptDefaults.addExtraLib(
                '',
                'file:///node_modules/@types/user.d.ts',
              );
            }
            if (!monacoInstance) return null;
            setCode(code);
            setLocalStorageCode(code);

            typeCheck(monacoInstance);
          }}
        />
        {userEditorState && settings.bindings === 'vim' && (
          <VimStatusBar editor={userEditorState} />
        )}
      </section>
    </div>
  );
}

async function typeCheck(monaco: typeof monacoType) {
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
        message: ts.flattenDiagnosticMessageText(d.messageText, '\n'),
      } satisfies monacoType.editor.IMarkerData;
    });

    monaco.editor.setModelMarkers(model, model.getLanguageId(), markers);
  }
}
