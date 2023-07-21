'use client';

import { UseFormReturn, useWatch } from 'react-hook-form';
import { FormField, FormItem, FormMessage } from '../ui/form';
import { RichMarkdownEditor } from '../ui/rich-markdown-editor';
import { Markdown } from '../ui/markdown';
import { TypographyH3 } from '../ui/typography/h3';

interface Props {
  form: UseFormReturn<
    {
      title: string;
      prompt: string;
      difficulty: 'BEGINNER' | 'EASY' | 'MEDIUM' | 'HARD' | 'EXTREME';
      description: string;
      shortDescription: string;
    },
    any,
    undefined
  >;
}

export function DescriptionEditor({ form }: Props) {
  const description = useWatch({ control: form.control, name: 'description' });
  return (
    <div className="p-6">
      <TypographyH3 className="mb-6">Challenge Description</TypographyH3>
      <div className="flex justify-center gap-6">
        <div className="flex w-1/3 flex-col gap-3">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => {
              return (
                <FormItem className="h-[400px]">
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
        <div>
          <Markdown>{description}</Markdown>
        </div>
      </div>
    </div>
  );
}
