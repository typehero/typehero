'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Form } from '~/components/ui/form';
import { useEditorSettingsStore } from './settings-store';
import { Input } from '../ui/input';

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

export function ShareForm() {
  const { settings } = useEditorSettingsStore();
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: settings,
  });

  return (
    <Form {...form}>
      <p className='pb-4'>Copy the url</p>
      <Input value={window.location.href} />
    </Form>
  );
}
