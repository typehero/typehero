'use client';

import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { updateProfile } from './profile.action';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { RichMarkdownEditor } from '../ui/rich-markdown-editor';
import { useState } from 'react';
import { Github, Linkedin, Twitter } from 'lucide-react';

interface FormValues {
  twitterUrl: string;
  githubUrl: string;
  linkedInUrl: string;
  bio: string;
}

const formSchema = z.object({
  twitterUrl: z.union([z.string().url().max(255), z.string().max(0)]),
  githubUrl: z.union([z.string().url().max(255), z.string().max(0)]),
  linkedInUrl: z.union([z.string().url().max(255), z.string().max(0)]),
  bio: z.string(),
});

export type FormSchema = z.infer<typeof formSchema>;

export const Settings = ({ data }: { data: FormSchema }) => {
  const [bio, setBio] = useState(data.bio);
  const { handleSubmit, register } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...data,
    },
  });

  const onSubmit = (values: FormValues) => {
    updateProfile({
      ...values,
      bio,
    });
  };

  return (
    <div className="container">
      <h2 className="text-3xl font-bold">Profile</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
          <h4 className="text-xl font-bold">Tell us about yourself</h4>
        <div className="h-[300px]">
          <RichMarkdownEditor value={bio} onChange={(val) => setBio(val)} />
        </div>

        <div className="mt-8 flex flex-col items-start space-y-3">
          <h4 className="text-xl font-bold">Social accounts</h4>
          <div className="flex items-center gap-2">
            <Github />
            <Input
              defaultValue={data.githubUrl}
              placeholder="Github url"
              className="w-64"
              {...register('githubUrl')}
            />
          </div>

          <div className="flex items-center gap-2">
            <Twitter />
            <Input
              defaultValue={data.twitterUrl}
              placeholder="Twitter url"
              className="w-64"
              {...register('twitterUrl', { maxLength: 255 })}
            />
          </div>
          <div className="flex items-center gap-2">
            <Linkedin />
            <Input
              defaultValue={data.linkedInUrl}
              placeholder="Linkedin url"
              className="w-64"
              {...register('linkedInUrl', { maxLength: 255 })}
            />
          </div>
          <Button>Update Profile</Button>
        </div>
      </form>
    </div>
  );
};
