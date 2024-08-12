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
import { createShortURLWithSlug } from '~/actions/create-url-with-slug';
import { createShortURL } from '~/actions/create-url';
import { Clipboard, ExternalLink } from '@repo/ui/icons';
import { Alert, AlertDescription, AlertTitle } from '@repo/ui/components/alert';
import Link from 'next/link';

const FormSchema = z.object({
  url: z.string().url({
    message: 'Please enter a valid URL e.g. https://typehero.dev',
  }),
  slug: z.string().optional(),
});

export function URLShortnerForm() {
  const [shortURL, setShortURL] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast();
  const SHORT_URL_LINK = process.env.NEXT_PUBLIC_SHORT_URL_LINK || 'localhost:3030';
  const form = useForm<z.infer<typeof FormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(FormSchema),
    defaultValues: {
      url: '',
      slug: '',
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setShortURL(null);
    if (data.slug && data.slug.length > 0) {
      createShortURLWithSlug(data.url, data.slug).then((shortURL) => {
        if (shortURL) {
          toast({
            title: 'Short URL created',
            description: shortURL,
            variant: 'success',
          });
          setShortURL(shortURL);
        } else {
          toast({
            title: 'Slug already exists',
            description: 'Please try another slug',
            variant: 'destructive',
          });
          if (shortURL === null) setError(`Slug '/${data.slug}' already exists for another URL`);
          else setError('Error creating short URL');
        }
      });
    } else {
      createShortURL(data.url).then((shortURL) => {
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
          setError('Error creating short URL');
        }
      });
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
                    {SHORT_URL_LINK}/
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
          <div className="flex w-full items-center gap-2">
            <div className="flex-grow rounded-xl border border-green-900 px-4 py-1.5">
              <span className="text-muted-foreground mr-2 text-sm">Short URL: </span>
              <span>{shortURL}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" type="button" variant="secondary">
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
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </form>
    </Form>
  );
}
