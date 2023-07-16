'use client';

import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
// import { updateProfile } from './settings.action';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { RichMarkdownEditor } from '../ui/rich-markdown-editor';
import { useState } from 'react';
import { Github, Linkedin, Twitter, Youtube, Link as LinkIcon } from 'lucide-react';

interface FormValues {
  socialUrls: CustomJsonValue;
  bio: string;
}

type CustomJsonValue = {
  [key: string]: any;
  [Symbol.iterator]?: () => IterableIterator<[string, any]>;
};
const formSchema = z.object({
  socialUrls: z.array(z.string()),
  bio: z.string(),
});

export type FormSchema = z.infer<typeof formSchema>;

export const Settings = ({ data }: { data: FormSchema }) => {
  const initialSocialUrls = Array.from({ length: 4 }, () => '');
  const [socialUrls, setSocialUrls] = useState(initialSocialUrls);

  const [bio, setBio] = useState(data.bio);
  const { handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...data,
    },
  });

  // const handleStateChange = (index: number, e: any) => {
  //   const values: FormValues = getValues();
  //   const newValues = { ...values };
  //   newValues.socialUrls = { ...values.socialUrls };
  //   newValues.socialUrls[index] = e.target.value;
  //   console.log(newValues.socialUrls);
  //   setValue('socialUrls', newValues.socialUrls);
  // };

  const handleStateChange = (index: number, value: string) => {
    const newValues = [...socialUrls];
    console.log(value);
    newValues[index] = value;
    setSocialUrls(newValues);
  };
  const onSubmit = (values: FormValues) => {
    console.log(values);
    // updateProfile(values);
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
          {socialUrls.map((url, i) => (
            <div key={`url-${i}`} className="flex items-center gap-2">
              <MagikcIcon url={url} />
              <Input
                value={url}
                defaultValue={url}
                placeholder="Link to social profile"
                className="w-64"
                onChange={(e) => handleStateChange(i, e.target.value)}
              />
            </div>
          ))}

          <Button>Update Profile</Button>
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
