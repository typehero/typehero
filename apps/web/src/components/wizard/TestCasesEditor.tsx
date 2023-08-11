import type { OnChange } from '@monaco-editor/react';
import { Settings } from 'lucide-react';
import type * as monaco from 'monaco-editor';
import { useCallback } from 'react';
import { LIB_URI, type TsErrors } from '../challenge/code-panel';
import { libSource } from '../challenge/code-panel/editor-types';
import { SettingsForm } from '../challenge/settings-form';
import { CodeEditor } from '../ui/code-editor';
import { FormField, FormItem, FormMessage } from '../ui/form';
import { TypographyH3 } from '../ui/typography/h3';
import type { WizardForm } from '.';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';

interface Props {
  form: WizardForm;
  hasTsErrors: boolean;
  setTsErrors: (errors: TsErrors) => void;
}

export function TestCasesEditor({ form, hasTsErrors, setTsErrors }: Props) {
  const onMount = useCallback(
    (onError: (v: TsErrors) => void) =>
      async (
        editor: monaco.editor.IStandaloneCodeEditor,
        // eslint-disable-next-line @typescript-eslint/consistent-type-imports
        monaco: typeof import('monaco-editor'),
      ) => {
        if (!monaco.editor.getModel(monaco.Uri.parse(LIB_URI))) {
          monaco.languages.typescript.javascriptDefaults.addExtraLib(libSource, LIB_URI);
          monaco.editor.createModel(libSource, 'typescript', monaco.Uri.parse(LIB_URI));
        }

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
        name="prompt"
        render={({ field }) => {
          return (
            <FormItem className="h-full">
              <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-300 dark:border-zinc-700">
                <div className="sticky top-0 flex h-[40px] flex-row-reverse items-center border-b border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-[#1e1e1e]">
                  <Dialog>
                    <DialogTrigger>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Settings
                            className="stroke-zinc-500 stroke-1 hover:stroke-zinc-400"
                            size={20}
                          />
                        </TooltipTrigger>
                        <TooltipContent className="px-2 py-1">Settings</TooltipContent>
                      </Tooltip>
                    </DialogTrigger>
                    <DialogContent className="w-[200px]">
                      <DialogHeader>
                        <DialogTitle>Settings</DialogTitle>
                      </DialogHeader>
                      <div className="pt-4">
                        <SettingsForm />
                      </div>
                    </DialogContent>
                  </Dialog>
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
