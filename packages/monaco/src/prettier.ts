import prettier from 'prettier/standalone';
import estree from 'prettier/plugins/estree';
import typescript from 'prettier/plugins/typescript';
import type { Options } from 'prettier';
import type * as monaco from 'monaco-editor';

// TODO: use the settings store for the config
const prettierConfig = {
  plugins: [estree, typescript],
  parser: 'typescript',
  useTabs: true,
  trailingComma: 'all',
  printWidth: 100,
} satisfies Options;

const displayName = 'prettier-formatter';

export const PrettierFormatProvider: monaco.languages.DocumentFormattingEditProvider = {
  displayName,
  async provideDocumentFormattingEdits(model) {
    try {
      const text = await prettier.format(model.getValue(), prettierConfig);

      return [
        {
          text,
          range: model.getFullModelRange(),
        },
      ];
    } catch (e) {
      console.error('prettier failed:', e);
    }
  },
};
