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
  const {
    handleSubmit,
    register,
  } = useForm<FormValues>({
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
    <div>
      <h1>Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Label>Bio</Label>
        <div className="h-[300px]">
          <RichMarkdownEditor value={bio} onChange={(val) => setBio(val)} />
        </div>

        <Input defaultValue={data.githubUrl} placeholder="Github url" {...register('githubUrl')} />
        <Label>Twitter</Label>
        <Input
          defaultValue={data.twitterUrl}
          placeholder="Twitter url"
          {...register('twitterUrl', { maxLength: 255 })}
        />
        <Label>Linkedin</Label>
        <Input
          defaultValue={data.linkedInUrl}
          placeholder="Linkedin url"
          {...register('linkedInUrl', { maxLength: 255 })}
        />
        <Button>Update Profile</Button>
      </form>
    </div>
  );
};
