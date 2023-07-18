'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Github, Link as LinkIcon, Linkedin, Twitter, Youtube } from 'lucide-react';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '../ui/button';
import { Form, FormItem } from '../ui/form';
import { Input } from '../ui/input';
import { RichMarkdownEditor } from '../ui/rich-markdown-editor';
import { ToastAction } from '../ui/toast';
import { toast } from '../ui/use-toast';
import { updateProfile } from './settings.action';

export interface UserLinkType {
  id: string | null;
  url: string;
}

const formSchema = z.object({
  userLinks: z.array(
    z.object({
      id: z.union([z.string(), z.null()]),
      url: z.union([z.string().url(), z.literal('')]),
    }),
  ),
  bio: z.string().optional(),
});

export type FormSchema = z.infer<typeof formSchema>;

export const Settings = ({ profileData }: { profileData: FormSchema }) => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...profileData,
    },
  });

  const {
    formState: { errors },
    control,
    getValues,
    register,
  } = form;

  const userLinks = useWatch({ control: form.control, name: 'userLinks' });

  const { fields } = useFieldArray({
    control,
    name: 'userLinks',
  });

  const onSubmit = async (values: FormSchema) => {
    const isValid = await form.trigger();

    if (!isValid) return;
    // call the server action
    await updateProfile(values);

    toast({
      variant: 'success',
      title: 'Your settings have been updated',
      action: <ToastAction altText="Settings updated">Settings updated</ToastAction>,
    });
  };

  return (
    <div className="container">
      <h2 className="mt-10 text-3xl font-bold">Profile</h2>
      <Form {...form}>
        <form action={() => onSubmit(getValues())}>
          <h4 className="mb-4 text-xl">Tell us about yourself</h4>
          <div className="h-[300px] w-[600px]">
            <Controller
              control={control}
              name="bio"
              render={({ field: { onChange, value } }) => (
                <RichMarkdownEditor value={value as string} onChange={onChange} />
              )}
            />
          </div>
          <div className="mt-8 flex flex-col items-start space-y-3">
            <h4 className="text-xl font-bold">Social accounts</h4>
            {fields.map((val, i) => {
              return (
                <FormItem className="mb-3" key={`url-link-${i}`}>
                  <div className="flex items-center gap-2">
                    <MagicIcon url={userLinks?.[i]?.url ?? ''} />
                    <Input
                      defaultValue={val?.url}
                      placeholder="Link to social profile"
                      className="w-64"
                      {...register(`userLinks.${i}.url`)}
                    />
                    {errors.userLinks?.[i]?.url?.message && (
                      <div className="text-red-500">{errors.userLinks?.[i]?.url?.message}</div>
                    )}
                  </div>
                </FormItem>
              );
            })}
          </div>

          <Button type="submit" className="mt-6">
            Save
          </Button>
        </form>
      </Form>
    </div>
  );
};

function MagicIcon({ url }: { url: string }) {
  if (url.startsWith('https://github.com/')) return <Github className="h-5 w-5 text-neutral-400" />;
  if (url.startsWith('https://twitter.com/'))
    return <Twitter className="h-5 w-5 text-neutral-400" />;
  if (url.startsWith('https://linked.in/'))
    return <Linkedin className="h-5 w-5 text-neutral-400" />;
  if (url.startsWith('https://youtube.com/'))
    return <Youtube className="h-5 w-5 text-neutral-400" />;
  return <LinkIcon className="h-5 w-5 text-neutral-400" />;
}
