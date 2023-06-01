import Editor from '@monaco-editor/react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import React from 'react';

declare global {
  interface Window {
    editor: any;
    treeStringToJson: any;
  }
}

type IGlobalEditorOptions = monaco.editor.IGlobalEditorOptions;
type IEditorOptions = monaco.editor.IEditorOptions;
type Monaco = typeof monaco;

export const options: IGlobalEditorOptions | IEditorOptions = {
  tabSize: 2,
  insertSpaces: false,
  minimap: {
    enabled: false,
  },
  readOnly: true,
};

const value = /* set from `myEditor.getModel()`: */ `import { equal } from "checking";
const r1 = equal<{ a: 1 } & { b: 1 }, { a: 1, b: 1 }>()`;
const libSource = `
declare module "checking" {
/// based on: https://github.com/type-challenges/type-challenges/blob/main/utils/index.d.ts
export type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? true : false

export type MergeInsertions<T> =
  T extends object
    ? { [K in keyof T]: MergeInsertions<T[K]> }
    : T

export type Alike<X, Y> = Equal<MergeInsertions<X>, MergeInsertions<Y>>

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never
///

export function equal<A, B>(...args: Alike<A, B> extends true ? [] : [a: A, b: B]): Alike<A, B> extends true ? "Equal" : "Not Equal";
}
`;

const libUri = 'ts:filename/checking.d.ts';
export const CodePanel = () => {
  const onMount = async (editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => {
    // const checkErrorsCmd = editor.addCommand(
    //   0,
    //   function () {
    //     if (runCommand) {
    //       runCommand();
    //     } else {
    //       alert('still loading');
    //     }
    //   },
    //   'checkErrorsCmd',
    // );
    // monaco.languages.registerCodeLensProvider('typescript', {
    //   provideCodeLenses: function (model, token) {
    //     return {
    //       lenses: [
    //         {
    //           range: {
    //             startLineNumber: 1,
    //             startColumn: 1,
    //             endLineNumber: 2,
    //             endColumn: 1,
    //           },
    //           id: 'Log TypeScript Errors to Console',
    //           command: {
    //             id: checkErrorsCmd,
    //             title: 'Log TypeScript Errors to Console',
    //           },
    //         },
    //       ],
    //       dispose: () => {},
    //     };
    //   },
    //   resolveCodeLens: function (model, codeLens, token) {
    //     return codeLens;
    //   },
    // });

    monaco.languages.typescript.javascriptDefaults.addExtraLib(libSource, libUri);
    monaco.editor.createModel(libSource, 'typescript', monaco.Uri.parse(libUri));

    const worker = await monaco.languages.typescript.getTypeScriptWorker();
    const ts = await worker(editor.getModel()?.uri!);

    const filename = editor.getModel()?.uri.toString();

    // what actually runs when checking errors
    const runCommand = async () => {
      console.log(
        ts.getSemanticDiagnostics(filename!), // actual type errors
        ts.getSyntacticDiagnostics(filename!),
        // ts.getSuggestionDiagnostics(filename), unused triggers this
        ts.getCompilerOptionsDiagnostics(filename!),
      );
    };

    editor.getModel()?.onDidChangeContent((x) => runCommand());
  };

  return (
    <div style={{ height: '400px' }}>
      <Editor theme="vs-dark" defaultLanguage="typescript" onMount={onMount} defaultValue={value} />
    </div>
  );
};

CodePanel.displayName = 'CodePanel';
