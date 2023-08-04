import type * as monaco from 'monaco-editor';

export declare function initVimMode(
  editor: monaco.editor.IStandaloneCodeEditor,
  statusbarNode?: Element | null,
): VimMode;

declare class VimMode {
  /** removes the attached vim bindings */
  dispose(): void;
}
