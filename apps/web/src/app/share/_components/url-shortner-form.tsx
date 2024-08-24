'use client';
import * as React from 'react';
import { Input } from '@repo/ui/components/input';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '@repo/ui/components/use-toast';
import { createShortURLWithSlug } from '../_actions/create-url-with-slug';
import { createShortURL } from '../_actions/create-url';
import { Clipboard, ExternalLink } from '@repo/ui/icons';
import { getBaseUrl } from '~/utils/getBaseUrl';

const FormSchema = z.object({
  url: z.string().url({
    message: 'Please enter a valid URL e.g. https://typehero.dev',
  }),
  slug: z.string().optional(),
});

export function URLShortnerForm() {
  const [shortURL, setShortURL] = React.useState<string | null>(null);
  const { toast } = useToast();
  const baseURL = `${getBaseUrl()}/share`;
  const form = useForm<z.infer<typeof FormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(FormSchema),
    defaultValues: {
      url: '',
      slug: '',
    },
  });

  const handleShareClick = async () => {
    if (navigator.clipboard) {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      toast({
        variant: 'success',
        description: 'Link To Short URL Copied!',
        title: 'Copied',
      });
    }
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setShortURL(null);
    if (data.slug && data.slug.length > 0) {
      const shortURL = await createShortURLWithSlug(data.url, data.slug);
      if (shortURL) {
        toast({
          title: 'Short URL created',
          description: shortURL,
          variant: 'success',
        });
        setShortURL(shortURL);
      } else {
        if (shortURL === null) {
          toast({
            title: `Slug '/${data.slug}' already exists`,
            description: 'Please try another slug',
            variant: 'destructive',
          });
        } else
          toast({
            title: 'Something went wrong',
            description: 'Error creating short URL',
            variant: 'destructive',
          });
      }
    } else {
      const shortURL = await createShortURL(data.url);
      if (shortURL) {
        toast({
          title: 'Short URL created',
          description: shortURL,
          variant: 'success',
        });
        setShortURL(shortURL);
      } else {
        toast({
          title: 'Error creating short URL',
          description: 'Please try again',
          variant: 'destructive',
        });
      }
    }
  }

  return (
    <Form {...form}>
      <form className="z-10 flex flex-col space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://typehero.dev/tracks/typescript-foundations"
                  autoFocus
                  className="border-slate-400 dark:border-slate-800"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{'Custom Slug (Optional)'}</FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <p className="border-r-none rounded-l-lg border border-slate-400 bg-slate-100 p-[5.5px] px-3 text-lg dark:border-slate-800 dark:bg-slate-800">
                    {baseURL}/
                  </p>
                  <Input
                    placeholder="virus-link"
                    {...field}
                    className="rounded-l-none border-l-0 border-slate-400 dark:border-slate-800"
                  />
                </div>
              </FormControl>
              <FormDescription>{'Leave empty to auto-generate a slug'}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          disabled={
            !form.formState.isDirty || !form.formState.isValid || form.formState.isSubmitting
          }
          type="submit"
          variant="secondary"
          className="border border-slate-400 dark:border-slate-800"
        >
          Shorten
        </Button>
        {shortURL && (
          <div className="flex w-full flex-col items-center gap-2 md:flex-row">
            <div className="flex-grow rounded-xl border border-green-900 px-4 py-1.5">
              <span className="text-muted-foreground mr-1 text-sm">Short URL: </span>
              <span className="text-sm">{shortURL}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleShareClick} size="sm" type="button" variant="secondary">
                <Clipboard className="mr-1 h-4 w-4" />
                Copy
              </Button>
              <a href={shortURL}>
                <Button size="sm" type="button" variant="link">
                  Test URL
                  <ExternalLink className="ml-1 h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
}
