declare module 'monaco-vim' {
  import type * as monaco from 'monaco-editor';

  export function initVimMode(
    editor: monaco.editor.IStandaloneCodeEditor,
    statusbarNode?: Element | null,
  ): CMAdapter;

  type VimModes = 'insert' | 'normal' | 'visual';

  class CMAdapter {
    /** removes the attached vim bindings */
    dispose(): void;

    attached: boolean;

    editor: monaco.editor.IStandaloneCodeEditor;

    statusBar: {
      clear(): void;
      node: HTMLElement;
    };

    /** @see https://codemirror.net/5/doc/manual.html#vimapi */
    static Vim: {
      map(lhs: string, rhs: string, ctx: VimModes): void;
      unmap(lhs: string, ctx: VimModes | false): boolean;
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
          ctx: CMAdapter,
          // TODO: Document other args
          ...args: [unknown, unknown]
        ) => void,
      ): void;

      defineEx(
        name: string,
        prefix: string | undefined,
        fn: (
          ctx: Ctx,
          data: {
            commandName: string;
            input: string;
          } & (
            | {
                argString: string;
                args: [string, ...string[]];
              }
            | { argString?: never; args?: never }
          ) &
            ({ line: undefined } | { line: number; lineEnd: number }),
        ) => void,
      ): void;

      /** clears user created mappings */
      mapclear(ctx?: VimMode): void;

      /** call this before `VimMode.Vim.handleKey` */
      maybeInitVimState_(cma: CMAdapter): void;

      /**
       * calls an ex command, equivalent to `:` in vim
       *
       * *If it fails with `vim is null` call `VimMode.Vim.maybeInitVimState_` first*
       */
      handleEx(cma: CMAdapter, ex: string): void;
    };
  }

  export { CMAdapter as VimMode, type CMAdapter };
}
