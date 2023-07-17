'use client';

import { useFieldArray, useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { updateProfile } from './settings.action';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { RichMarkdownEditor } from '../ui/rich-markdown-editor';
import { useState } from 'react';
import { Github, Linkedin, Twitter, Youtube, Link as LinkIcon } from 'lucide-react';

interface FormValues {
  userLinks: {
    id: string | null;
    value: string;
  }[];
  bio: string;
}

const formSchema = z.object({
  // userLinks: z.array(
  //   z.object({
  //     id: z.string().nullable().optional(),
  //     url: z.string().optional()
  //   }).optional(),
  // ),
  userLinks: z.any(),
  bio: z.string(),
});

export type FormSchema = z.infer<typeof formSchema>;

export const Settings = ({ data }: { data: FormSchema }) => {
  const [bio, setBio] = useState(data.bio);
  const { handleSubmit, control, formState: {errors}, register } = useForm < FormValues > ({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...data
    },
  });

  useFieldArray({
    control,
    name: 'userLinks',
  });

  const onSubmit = (values: FormValues) => {
    const dataToSubmit = data.userLinks.map((link, i) => ({
      ...link,
      url: values.userLinks[i].value ?? '',
    }));

    console.log(JSON.stringify(dataToSubmit, null, 2));
    // updateProfile({
    //   bio: values.bio,
    // });
  };

  return (
    <div className="container">
      <h2 className="text-3xl font-bold">Profile</h2>
      <pre>{JSON.stringify(errors.userLinks, null, 2)}</pre>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h4 className="text-xl font-bold">Tell us about yourself</h4>
        <div className="h-[300px]">
          <RichMarkdownEditor value={bio} onChange={(val) => setBio(val)} />
        </div>

        { }
        <div className="mt-8 flex flex-col items-start space-y-3">
          <h4 className="text-xl font-bold">Social accounts</h4>
          {Array(4)
            .fill('')
            .map((_, i) => {
              const val: any = data.userLinks[i];
              return (
                <div key={`url-${i}`} className="flex items-center gap-2">
                  <MagikcIcon url={val?.url ?? ''} />
                  <Input
                    defaultValue={val?.url}
                    placeholder="Link to social profile"
                    className="w-64"
                    {...register(`userLinks.${i}.value`)}
                  />
                </div>
              );
            })}

          <Button type="submit">Update Profile</Button>
        </div>
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
