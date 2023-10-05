'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { User } from '@repo/db/types';
import { Button } from '@repo/ui/components/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/form';
import { Input } from '@repo/ui/components/input';
import { MagicIcon } from '@repo/ui/components/magic-icon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/select';
import { Separator } from '@repo/ui/components/separator';
import { useToast } from '@repo/ui/components/use-toast';
import Link from 'next/link';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { RichMarkdownEditor } from '~/components/rich-markdown-editor';
import { createNoProfanitySchemaWithValidate } from '~/utils/antiProfanityZod';
import { updateProfile } from './settings.action';

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: 'Username must be at least 2 characters.',
    })
    .max(30, {
      message: 'Username must not be longer than 30 characters.',
    }),
  email: z
    .string({
      required_error: 'Please select an email to display.',
    })
    .email(),
  bio: createNoProfanitySchemaWithValidate((str) => str.max(256)),
  userLinks: z.array(
    z.object({
      id: z.union([z.string(), z.null()]),
      url: z.union([
        createNoProfanitySchemaWithValidate((str) => str.url().max(256)),
        z.literal(''),
      ]),
    }),
  ),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
interface Props {
  user: User & { userLinks: { id: string | null; url: string }[] };
}

export function ProfileSettings({ user }: Props) {
  return (
    <div className="space-y-8 p-8">
      <div className="mb-4">
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-muted-foreground mb-4 text-sm">
          This is how others will see you on the site.
        </p>
        <Separator />
      </div>
      <ProfileForm user={user} />
    </div>
  );
}

function ProfileForm({ user }: Props) {
  const { toast } = useToast();

  // NOTE: make the user links have 4 at all times
  const userLinks = (user.userLinks = [
    ...user.userLinks,
    ...Array(4 - user.userLinks.length).fill({
      id: null,
      url: '',
    }),
  ])
    // NOTE: sort the user links so empty strings are at the bottom
    .sort((a, b) => b.url.localeCompare(a.url));

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: 'onChange',
    defaultValues: {
      bio: user.bio,
      email: user.email!,
      userLinks,
      username: user.name,
    },
  });

  const {
    formState: { errors },
    control,
    register,
  } = form;

  const { fields } = useFieldArray({
    control,
    name: 'userLinks',
  });

  async function onSubmit(data: ProfileFormValues) {
    // TODO: handle errors

    await updateProfile(data);

    toast({
      title: 'profile updated',
      variant: 'success',
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={(e) => form.handleSubmit(onSubmit)(e)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input disabled placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name. It can be your real name or a pseudonym. You can
                only change this once every 30 days.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={user.email!}>{user.email}</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                You can manage verified email addresses in your{' '}
                <Link href="/examples/forms">email settings</Link>.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="h-[300px] md:w-[600px]">
              <FormLabel>Bio</FormLabel>
              <RichMarkdownEditor onChange={field.onChange} value={field.value} />
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col items-start space-y-3 pt-8">
          <h4 className="text-sm font-medium">Social accounts</h4>
          {fields.map((val, i) => {
            return (
              <FormItem className="mb-3" key={`url-link-${i}`}>
                <div className="flex items-center gap-2">
                  <MagicIcon url={userLinks[i]?.url ?? ''} />
                  <Input
                    className="w-64"
                    defaultValue={val.url}
                    placeholder="Link to social profile"
                    {...register(`userLinks.${i}.url`)}
                  />
                  {errors.userLinks?.[i]?.url?.message ? (
                    <div className="text-destructive">{errors.userLinks[i]?.url?.message}</div>
                  ) : null}
                </div>
              </FormItem>
            );
          })}
        </div>

        <Button type="submit">Update profile</Button>
      </form>
    </Form>
  );
}
