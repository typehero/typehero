'use client';

import { useWatch } from 'react-hook-form';
import { type WizardForm } from '.';
import { FormField, FormItem, FormMessage } from '../ui/form';
import { Markdown } from '../ui/markdown';
import { RichMarkdownEditor } from '../ui/rich-markdown-editor';
import { TypographyH3 } from '../ui/typography/h3';

interface Props {
  form: WizardForm;
}

export function DescriptionEditor({ form }: Props) {
  const description = useWatch({ control: form.control, name: 'description' });
  return (
    <div className="flex h-full flex-col py-6">
      <TypographyH3 className="mb-6">Create Challenge Description</TypographyH3>
      <div className="flex flex-1 gap-6">
        <div className="flex w-[500px] flex-col gap-3">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => {
              return (
                <FormItem className="h-full">
                  <RichMarkdownEditor
                    value={field.value as string}
                    onChange={field.onChange}
                    dismissPreview
                  />
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>
        <div className="h-full w-full rounded-md border border-zinc-300 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-800">
          <Markdown>{description}</Markdown>
        </div>
      </div>
    </div>
  );
}
