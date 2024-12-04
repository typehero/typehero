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
import { Clipboard, ExternalLink, Calendar as CalendarIcon } from '@repo/ui/icons';
import { format } from 'date-fns';
import { cn } from '@repo/ui/cn';
import { Calendar } from '@repo/ui/components/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@repo/ui/components/popover';
import { Checkbox } from '@repo/ui/components/checkbox';
import { ONE_YEAR, THREE_MONTHS } from '../_actions/increment-time';

const FormSchema = z.object({
  url: z.string().url({
    message: 'Please enter a valid URL e.g. https://typehero.dev',
  }),
  slug: z.string().optional(),
  expireAt: z.date().optional(),
  overwrite: z.boolean().default(false).optional(),
});

export function URLShortenerForm() {
  const [shortURL, setShortURL] = React.useState<string | null>(null);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof FormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(FormSchema),
    defaultValues: {
      url: '',
      slug: '',
      expireAt: new Date(Date.now() + THREE_MONTHS),
      overwrite: true,
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
      try {
        const shortURL = await createShortURLWithSlug(
          data.url,
          data.slug,
          data.expireAt,
          data.overwrite,
        );
        if (shortURL) {
          toast({
            title: 'Short URL created',
            description: shortURL,
            variant: 'success',
          });
          setShortURL(shortURL);
        } else {
          toast({
            title: `Slug '/${data.slug}' already exists`,
            description: 'Please try another slug',
            variant: 'destructive',
          });
        }
      } catch {
        toast({
          title: 'Something went wrong',
          description: 'Error creating short URL',
          variant: 'destructive',
        });
      }
    } else {
      // create short url with auto-generated slug
      const shortURL = await createShortURL(data.url, {
        expiresAt: data.expireAt,
        forceNewUrl: data.overwrite,
      });
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
              <FormLabel>Custom Slug (Optional)</FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <p className="border-r-none text-from-foreground/50 rounded-l-lg border border-slate-400 bg-slate-100 p-[5.5px] px-3 font-light dark:border-slate-800 dark:bg-slate-800">
                    share/
                  </p>
                  <Input
                    placeholder="virus-link"
                    {...field}
                    className="rounded-l-none border-l-0 border-slate-400 dark:border-slate-800"
                  />
                </div>
              </FormControl>
              <FormDescription>Leave empty to auto-generate a slug</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="expireAt"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Expires At</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-[240px] pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      {field.value ? format(field.value, 'PPP') : <span>Expires At</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date() || date > new Date(Date.now() + ONE_YEAR * 2)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="overwrite"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked: boolean) => field.onChange(checked)}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Overwrite existing url</FormLabel>
                <FormDescription>
                  It will overwrite the url, if the slug already exists.
                </FormDescription>
              </div>
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
        {shortURL ? (
          <div className="flex w-full flex-col items-center gap-2 md:flex-row">
            <div className="border-primary flex-grow rounded-xl border px-4 py-1.5">
              <span className="text-muted-foreground mr-1 text-sm">Short URL: </span>
              <span className="text-sm">{shortURL}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleShareClick} size="sm" type="button" variant="secondary">
                <Clipboard className="mr-1 h-4 w-4" />
                Copy
              </Button>
              <a href={shortURL} className="flex-shrink-0" target="_blank" rel="noopener">
                <Button size="sm" type="button" variant="link">
                  Test URL
                  <ExternalLink className="ml-1 h-4 w-4 flex-shrink-0" />
                </Button>
              </a>
            </div>
          </div>
        ) : null}
      </form>
    </Form>
  );
}
