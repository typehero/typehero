import type * as monaco from 'monaco-editor';

export declare function initVimMode(
  editor: monaco.editor.IStandaloneCodeEditor,
  statusbarNode?: Element | null,
): VimMode;

export type VimEditorMode = "normal" | "insert" | "visual";

declare class VimMode {
  /** removes the attached vim bindings */
  dispose(): void;
  /** subscribeable event returns the current vim mode */
  on: (event: 'vim-mode-change', callback: (e: { mode: VimEditorMode }) => void) => void;
}
