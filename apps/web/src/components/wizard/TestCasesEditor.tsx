import type { OnChange } from '@monaco-editor/react';
import type { TsErrors } from '@repo/monaco';
import { CodeEditor, loadCheckingLib, type CodeEditorProps } from '@repo/monaco/code-editor';
import { FormField, FormItem, FormMessage, TypographyH3 } from '@repo/ui';
import { useCallback } from 'react';
import type { WizardForm } from '.';
import { SettingsButton } from '~/app/challenge/_components/settings/settings-button';

interface Props {
  form: Pick<WizardForm, 'control'>;
  hasTsErrors: boolean;
  setTsErrors: (errors: TsErrors) => void;
}

export function TestCasesEditor({ form, hasTsErrors, setTsErrors }: Props) {
  const onMount = useCallback(
    (onError: (v: TsErrors) => void): CodeEditorProps['onMount'] =>
      async (editor, monaco) => {
        loadCheckingLib(monaco);

        const model = editor.getModel();

        if (!model) {
          throw new Error();
        }

        const ts = await (await monaco.languages.typescript.getTypeScriptWorker())(model.uri);

        const filename = model.uri.toString();

        // what actually runs when checking errors
        const typeCheck = async () => {
          const errors = await Promise.all([
            ts.getSemanticDiagnostics(filename),
            ts.getSyntacticDiagnostics(filename),
            ts.getSuggestionDiagnostics(filename),
            ts.getCompilerOptionsDiagnostics(filename),
          ] as const);

          onError(errors);
        };

        model.onDidChangeContent(() => {
          typeCheck().catch(console.error);
        });

        await typeCheck();
      },
    [],
  );

  return (
    <div className="flex h-full flex-1 flex-col">
      <TypographyH3 className="mx-auto mb-4 lg:mb-6">Create Test Cases</TypographyH3>
      <FormField
        control={form.control}
        name="tests"
        render={({ field }) => {
          return (
            <FormItem className="h-full">
              <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-300 dark:border-zinc-700">
                <div className="sticky top-0 flex h-[40px] flex-row-reverse items-center border-b border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-[#1e1e1e]">
                  <SettingsButton />
                </div>
                <div className="w-full flex-1">
                  <CodeEditor
                    onChange={field.onChange as OnChange}
                    onMount={onMount(setTsErrors)}
                    value={field.value}
                  />
                </div>
                <FormMessage />
                {!hasTsErrors && (
                  <div className="text-destructive text-sm">You must have failing test cases</div>
                )}
              </div>
            </FormItem>
          );
        }}
      />
    </div>
  );
}
