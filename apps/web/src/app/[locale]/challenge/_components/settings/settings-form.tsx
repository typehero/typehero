'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { DEFAULT_SETTINGS, useEditorSettingsStore } from '@repo/monaco/settings-store';
import { useToast } from '@repo/ui/components/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/select';
import { DialogFooter } from '@repo/ui/components/dialog';
import { Button } from '@repo/ui/components/button';
import { Textarea } from '@repo/ui/components/textarea';

const formSchema = z.object({
  fontSize: z.string(),
  bindings: z.string(),
  tabSize: z.string(),
  vimConfig: z.string(),
});

export type FormSchema = z.infer<typeof formSchema>;

export function SettingsForm() {
  const { toast } = useToast();

  const { settings, updateSettings } = useEditorSettingsStore();
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: settings,
  });
  const isVimBindings = form.getValues().bindings === 'vim';

  function onSubmit(data: FormSchema) {
    updateSettings(data);
    toast({
      title: 'Settings updated!',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="fontSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Font Size</FormLabel>
              <Select defaultValue={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a font size" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="12">12px</SelectItem>
                  <SelectItem value="13">13px</SelectItem>
                  <SelectItem value="14">14px</SelectItem>
                  <SelectItem value="15">15px</SelectItem>
                  <SelectItem value="16">16px</SelectItem>
                  <SelectItem value="17">17px</SelectItem>
                  <SelectItem value="18">18px</SelectItem>
                  <SelectItem value="19">19px</SelectItem>
                  <SelectItem value="20">20px</SelectItem>
                  <SelectItem value="21">21px</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tabSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tab Size</FormLabel>
              <Select defaultValue={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tab size" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="2">2 spaces</SelectItem>
                  <SelectItem value="4">4 spaces</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bindings"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Key Bindings</FormLabel>
              <Select defaultValue={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Key Binding Style" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="vim">Vim</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {isVimBindings ? (
          <FormField
            control={form.control}
            name="vimConfig"
            render={({ field: { value, ...field } }) => (
              <FormItem>
                <FormLabel>Vim Config</FormLabel>
                <Textarea
                  value={value || DEFAULT_SETTINGS.vimConfig}
                  className="h-60 resize-none font-mono"
                  {...field}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}

        <DialogFooter className="mt-3">
          <DialogPrimitive.Close asChild>
            <Button type="submit">Save</Button>
          </DialogPrimitive.Close>
        </DialogFooter>
      </form>
    </Form>
  );
}
