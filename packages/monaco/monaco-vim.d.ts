declare module 'monaco-vim' {
  import type * as monaco from 'monaco-editor';

  export function initVimMode(
    editor: monaco.editor.IStandaloneCodeEditor,
    statusbarNode?: Element | null,
  ): VimMode;

  type VimModes = 'insert' | 'normal' | 'visual';

  export class VimMode {
    /** removes the attached vim bindings */
    dispose(): void;

    static Vim: {
      map(lhs: string, rhs: string, ctx: VimModes): void;
      unmap(lhs: string, ctx: VimModes): boolean;
      noremap(lhs: string, rhs: string, ctx: VimModes): void;

      mapCommand(
        keys: string,
        type: 'action',
        name: string,
        args?: Record<PropertyKey, unknown>,
        extra?: Record<PropertyKey, unknown>,
      ): void;

      defineAction(
        name: string,
        fn: (
          cm: { editor: monaco.editor.IStandaloneCodeEditor },
          arg2: { registerName: null | string; repeat: number; repeatIsExplicit: boolean },
          arg3: unknown,
        ) => void,
      ): void;

      defineEx(
        name: string,
        prefix: string | undefined,
        fn: (
          ctx: { editor: monaco.editor.IStandaloneCodeEditor },
          data: {
            argString: string[];
            args: string;
            commandName: string;
            input: string;
          } & ({ line: undefined } | { line: number; lineEnd: number }),
        ) => void,
      ): void;
    };
  }
}
