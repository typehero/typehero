'use client';

import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { updateProfile } from './settings.action';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { RichMarkdownEditor } from '../ui/rich-markdown-editor';
import { Github, Linkedin, Twitter, Youtube, Link as LinkIcon } from 'lucide-react';
import { experimental_useFormStatus as useFormStatus } from 'react-dom';
import { useEffect } from 'react';

export interface UserLinkType {
  id: string | null;
  url: string;
}

interface FormValues {
  userLinks: UserLinkType[];
  bio: string;
}

export type FormSchema = z.infer<typeof formSchema>;

const formSchema = z.object({
  // TODO: make this have a good typesafe exp
  // userLinks: z.array(
  //   z.object({
  //     id: z.string().nullable(),
  //     url: z.string().url(),
  //   }),
  // ),
  userLinks: z.any(),
  bio: z.string(),
});

export const Settings = ({ data }: { data: FormSchema }) => {
  const { pending } = useFormStatus();
  const {
    formState: { isSubmitSuccessful },
    reset,
    control,
    getValues,
    register,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...data,
    },
  });

  const { fields } = useFieldArray({
    control,
    name: 'userLinks',
  });

  const onSubmit = async (values: FormValues) => {
    const userLinks = data.userLinks.map((link: UserLinkType, i: number) => ({
      ...link,
      // @ts-ignore
      url: values.userLinks[i].value,
    }));

    const updateProfileData = {
      bio: values.bio,
      userLinks,
    };

    // call the server action
    await updateProfile(updateProfileData);
    // reset(data);
  };

  return (
    <div className="container">
      <h2 className="mt-10 text-3xl font-bold">Profile</h2>
      <form action={() => onSubmit(getValues())}>
        <h4 className="mb-4 text-xl">Tell us about yourself</h4>
        <div className="h-[300px] w-[600px]">
          <Controller
            control={control}
            name="bio"
            render={({ field: { onChange, value } }) => (
              <RichMarkdownEditor value={value} onChange={onChange} />
            )}
          />
        </div>

        <div className="mt-8 flex flex-col items-start space-y-3">
          <h4 className="text-xl font-bold">Social accounts</h4>
          {data.userLinks
            .sort((a, b) => b.url.localeCompare(a.url))
            .map((val: UserLinkType, i: number) => {
              return (
                <div key={`url-${i}`} className="flex items-center gap-2">
                  <MagikcIcon url={val?.url ?? ''} />
                  <Input
                    defaultValue={val?.url}
                    placeholder="Link to social profile"
                    className="w-64"
                    // @ts-ignore
                    {...register(`userLinks.${i}.value`)}
                  />
                  {JSON.stringify(val)}
                </div>
              );
            })}
        </div>
        <pre>{JSON.stringify(data, null, 2)}</pre>

        <Button type="submit" className="mt-6">
          {!pending && 'Save'}
          {pending && 'Saving...'}
        </Button>
      </form>
    </div>
  );
};

function MagikcIcon({ url }: { url: string }) {
  if (url.startsWith('https://github.com/')) return <Github className="h-5 w-5 text-neutral-400" />;
  if (url.startsWith('https://twitter.com/'))
    return <Twitter className="h-5 w-5 text-neutral-400" />;
  if (url.startsWith('https://linked.in/'))
    return <Linkedin className="h-5 w-5 text-neutral-400" />;
  if (url.startsWith('https://youtube.com/'))
    return <Youtube className="h-5 w-5 text-neutral-400" />;
  return <LinkIcon className="h-5 w-5 text-neutral-400" />;
}
