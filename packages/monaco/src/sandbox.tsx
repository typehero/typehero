import type MonacoEditor from 'monaco-editor';

import { useEffect, useRef } from 'react';

type Monaco = typeof MonacoEditor;

export function Sandbox({ tsVersion }: { tsVersion: string }) {
  const wrapper = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!wrapper.current) return;

    const editor = wrapper.current;

    const init = async () => {
      console.log('loading ts version', tsVersion);
      const { monaco } = await loadSandbox(tsVersion);

      editor.style.height = '100vh';
      const properties = {
        value: "function hello() {\n\talert('Hello world!');\n}",
        language: 'typescript',
      };

      monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);

      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        allowNonTsExtensions: true,
        strict: true,
        target: monaco.languages.typescript.ScriptTarget.ESNext,
        strictNullChecks: true,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        allowSyntheticDefaultImports: true,
        outDir: 'lib', // kills the override input file error
      });

      //
      // const getTsWorker = await monaco.languages.typescript.getTypeScriptWorker();
      // const tsWorker = await getTsWorker(model.uri);

      monaco.editor.create(editor, properties);
    };

    init();
  }, [tsVersion]);

  return <div ref={wrapper}></div>;
}
// vs: `https://playgroundcdn.typescriptlang.org/cdn/5.5.4/monaco/min/vs`,

function loadSandbox(tsVersion: string): Promise<{ monaco: Monaco }> {
  return new Promise((resolve, reject): void => {
    const getLoaderScript = document.createElement('script');
    getLoaderScript.src = `https://playgroundcdn.typescriptlang.org/cdn/${tsVersion}/monaco/min/vs/loader.js`;
    getLoaderScript.async = true;
    getLoaderScript.onload = (): void => {
      // For the monaco version you can use unpkg or the TypeScript web infra CDN
      // You can see the available releases for TypeScript here:
      // https://typescript.azureedge.net/indexes/releases.json
      window.require.config({
        paths: {
          vs: `https://playgroundcdn.typescriptlang.org/cdn/${tsVersion}/monaco/min/vs`,
        },
      });

      // Grab a copy of monaco, TypeScript and the sandbox
      window.require<[Monaco]>(
        ['vs/editor/editor.main'],
        (monaco) => {
          resolve({ monaco });
        },
        () => {
          reject(new Error('Could not get all the dependencies of sandbox set up!'));
        },
      );
    };
    document.body.appendChild(getLoaderScript);
  });
}
