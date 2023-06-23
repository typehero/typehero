'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '~/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { toast } from '~/components/ui/use-toast';
import useLocalStorage from '~/utils/useLocalStorage';

const formSchema = z.object({
  fontSize: z.string(),
  bindings: z.string(),
  tabSize: z.string(),
});

export type FormSchema = z.infer<typeof formSchema>;

export const DEFAULT_SETTINGS = {
  fontSize: '12',
  bindings: 'standard',
  tabSize: '2',
};
export function SettingsForm() {
  const [settings, setSettings] = useLocalStorage('settings', JSON.stringify(DEFAULT_SETTINGS));
  const parsedSettings = JSON.parse(settings) as FormSchema;
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fontSize: parsedSettings.fontSize,
      bindings: parsedSettings.bindings,
      tabSize: parsedSettings.tabSize,
    },
  });

  function onSubmit(data: FormSchema) {
    setSettings(JSON.stringify(data));
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
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="fontSize"
          render={({ field }) => (
            <FormItem className="mb-3">
              <FormLabel>Font Size</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          name="bindings"
          render={({ field }) => (
            <FormItem className="mb-3">
              <FormLabel>Key Bindings</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a font size" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="vim">Vim</SelectItem>
                  <SelectItem value="emacs">Emacs</SelectItem>
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
            <FormItem className="mb-3">
              <FormLabel>Tab Size</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
