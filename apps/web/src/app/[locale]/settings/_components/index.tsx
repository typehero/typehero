'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { updateProfile } from './settings.action';
import { toast } from '@repo/ui/components/use-toast';
import { Button } from '@repo/ui/components/button';
import { Form, FormField, FormItem, FormMessage } from '@repo/ui/components/form';
import { MagicIcon } from '@repo/ui/components/magic-icon';
import { Input } from '@repo/ui/components/input';
import { createNoProfanitySchemaWithValidate } from '~/utils/antiProfanityZod';
import { RichMarkdownEditor } from '~/components/rich-markdown-editor';

export interface UserLinkType {
  id: string | null;
  url: string;
}

const formSchema = z.object({
  userLinks: z.array(
    z.object({
      id: z.union([z.string(), z.null()]),
      url: z.union([
        createNoProfanitySchemaWithValidate((str) => str.url().max(256)),
        z.literal(''),
      ]),
    }),
  ),
  bio: createNoProfanitySchemaWithValidate((str) => str.max(256)),
});

export type FormSchema = z.infer<typeof formSchema>;

// million-ignore
export function Settings({ profileData, username }: { profileData: FormSchema; username: string }) {
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
    });
  };

  return (
    <div className="container">
      <div className="mt-10 flex w-full justify-between">
        <div className="mr-10">
          <h2 className="text-3xl font-bold">Settings</h2>
          <h4 className="mb-4 mt-6 text-xl font-bold">Bio</h4>
        </div>

        <Link className="mb-6" href={`@${username}`}>
          <Button type="button" variant="outline">
            View profile
          </Button>
        </Link>
      </div>

      <Form {...form}>
        <form action={() => onSubmit(getValues())}>
          <div>
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem className="h-[300px] w-[600px]">
                  <RichMarkdownEditor onChange={field.onChange} value={field.value} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="mt-8 flex flex-col items-start space-y-3">
            <h4 className="text-xl font-bold">Social accounts</h4>
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

          <Button className="mt-6" type="submit">
            Save
          </Button>
        </form>
      </Form>
    </div>
  );
}
