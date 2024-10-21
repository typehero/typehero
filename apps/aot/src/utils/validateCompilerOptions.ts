import type * as monaco from 'monaco-editor';

export const validateCompilerOptions = (value: unknown): value is TSCompilerOptions =>
  value == null || (typeof value === 'object' && !Array.isArray(value));

export type TSCompilerOptions = monaco.languages.typescript.CompilerOptions | undefined;
