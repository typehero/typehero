'use client';

import { Settings } from 'lucide-react';
import type * as monaco from 'monaco-editor';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';
import type { WizardForm } from '.';
import { LIB_URI, type TsErrors } from '../challenge/code-panel';
import { libSource } from '../challenge/code-panel/editor-types';
import { SettingsForm } from '../challenge/settings-form';
import { CodeEditor } from '../ui/code-editor';
import { FormField, FormItem, FormMessage } from '../ui/form';
import { TypographyH3 } from '../ui/typography/h3';
import type { OnChange } from '@monaco-editor/react';

interface Props {
  form: WizardForm;
}

export function TestCasesEditor({ form }: Props) {
  const [, setTsErrors] = useState<TsErrors>([[], [], [], []]);
  const onMount =
    (onError: (v: TsErrors) => void) =>
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    async (editor: monaco.editor.IStandaloneCodeEditor, monaco: typeof import('monaco-editor')) => {
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
    };
  return (
    <div className="flex h-full flex-col py-6">
      <TypographyH3 className="mb-6">Create Test Cases</TypographyH3>
      <FormField
        control={form.control}
        name="prompt"
        render={({ field }) => {
          return (
            <FormItem className="h-full">
              <div className="flex h-full flex-col">
                <div className="sticky top-0 flex h-[40px] flex-row-reverse items-center border-b border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-[#1e1e1e]">
                  <Dialog>
                    <DialogTrigger>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Settings
                            size={20}
                            className="stroke-zinc-500 stroke-1 hover:stroke-zinc-400"
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
                    onMount={onMount(setTsErrors)}
                    value={field.value}
                    onChange={field.onChange as OnChange}
                  />
                </div>
              </div>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </div>
  );
}
// Add these extra validations
// if (!/(?:\n|^)\s*(?:Equal|Extends|NotEqual|Expect)</.test(code)) {
//   toast({
//     variant: 'destructive',
//     title: 'You need to have test cases in your challenge',
//     action: <ToastAction altText="Try again">Try again</ToastAction>,
//   });
//
// const hasErrors = !!tsErrors[0].length;
//
// if (!USER_CODE_START_REGEX.test(code)) {
//   toast({
//     variant: 'destructive',
//     title: `You need to have the line \`${USER_CODE_START}\` to signify the non-editable part`,
//     action: <ToastAction altText="Try again">Try again</ToastAction>,
//   });
//
//
