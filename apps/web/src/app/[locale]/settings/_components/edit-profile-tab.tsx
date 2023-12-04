'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';

import type { User } from '@repo/db/types';
import { Button } from '@repo/ui/components/button';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@repo/ui/components/form';
import { Input } from '@repo/ui/components/input';
import { MagicIcon } from '@repo/ui/components/magic-icon';
import { useToast } from '@repo/ui/components/use-toast';

import { RichMarkdownEditor } from '~/components/rich-markdown-editor';

import { updateProfile } from './settings.action';
import { profileSchema, type ProfileSchema } from './schema';

interface Props {
  user: User & { userLinks: { id: string | null; url: string }[] };
}

export function ProfileSettings({ user }: Props) {
  return (
    <div>
      <ProfileForm user={user} />
    </div>
  );
}

function ProfileForm({ user }: Props) {
  const { toast } = useToast();

  // NOTE: make the user links have 4 at all times
  const userLinksLength: number = user.userLinks?.length ?? 0;
  const userLinks = (user.userLinks = [
    ...user.userLinks,
    ...Array(4 - userLinksLength).fill({
      id: null,
      url: '',
    }),
  ])
    // NOTE: sort the user links so empty strings are at the bottom
    .sort((a, b) => b.url.localeCompare(a.url));

  const form = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    mode: 'onChange',
    defaultValues: {
      bio: user.bio,
      userLinks,
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

  async function onSubmit(data: ProfileSchema) {
    try {
      await updateProfile(data);
      toast({
        title: 'profile updated',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Could not update profile',
        variant: 'destructive',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={(e) => form.handleSubmit(onSubmit)(e)} className="space-y-8">
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
          <h4 className="text-sm font-medium">Social Links</h4>
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

        <Button type="submit" disabled={form.formState.isSubmitting}>
          Update profile
        </Button>
      </form>
    </Form>
  );
}
