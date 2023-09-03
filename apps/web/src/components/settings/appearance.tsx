'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { User } from '@repo/db/types';
import {
  Button,
  Card,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  RadioGroup,
  RadioGroupItem,
  Separator,
  Tabs,
  VerticalTabsContent,
  VerticalTabsList,
  VerticalTabsTrigger,
  buttonVariants,
  cn,
  toast,
} from '@repo/ui';
import { ChevronDownIcon } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import UserHeader from '~/components/user/dashboard/user-header';
import { getRelativeTime } from '~/utils/relativeTime';
import { links } from './new-settings';

interface Props {
  user: User & { userLinks: { id: string | null; url: string }[] };
}

export const Appearance = ({ user }: Props) => {
  return (
    <div className="container">
      <Tabs className="flex flex-col gap-8 py-8 md:flex-row" defaultValue="appearance">
        <VerticalTabsList>
          <div className="mb-2 flex flex-col items-center md:items-start">
            <div
              className="mb-10 h-32 w-32 rounded-3xl bg-cover bg-center bg-no-repeat md:h-64 md:w-64"
              style={{ backgroundImage: `url(${user.image ?? '/avatar.jpeg'})` }}
            />
            <UserHeader user={user} isOwnProfile />
            <p
              className="text-sm italic tracking-tight text-neutral-500"
              title={`Joined ${user.createdAt.toString()}`}
            >
              Joined {getRelativeTime(user.createdAt)}
            </p>
            <div className="mb-4 mt-2 w-full text-center text-sm md:w-64 md:text-start">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Minima temporibus maiores
              nesciunt hic dolores aspernatur corrupti laboriosam consectetur. Vitae, consectetur?
            </div>
          </div>
          <div className="flex gap-4 pr-6 md:flex-col">
            {links.map(({ icon: Icon, name, link, disabled }) => (
              <Link href={link} key={name} className="w-full">
                <VerticalTabsTrigger
                  className="flex w-full items-center justify-center gap-3 px-2 md:justify-normal md:px-3"
                  value={name.toLowerCase()}
                  key={name}
                  disabled={disabled}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden md:block">{name}</span>
                </VerticalTabsTrigger>
              </Link>
            ))}
          </div>
        </VerticalTabsList>
        <VerticalTabsContent className="shrink grow space-y-4" value="appearance">
          <Card className="col-span-4 min-h-[calc(100vh_-_56px_-_6rem)]">
            <Appearances />
          </Card>
        </VerticalTabsContent>
      </Tabs>
    </div>
  );
};

function Appearances() {
  return (
    <div className="max-w-lg space-y-6 p-8">
      <div className="mb-4">
        <h3 className="text-lg font-medium">Notifications</h3>
        <p className="text-muted-foreground mb-4 text-sm">
          Configure how you receive notifications.
        </p>
        <Separator />
      </div>
      <AppearanceForm />
    </div>
  );
}

const appearanceFormSchema = z.object({
  theme: z.enum(['light', 'dark'], {
    required_error: 'Please select a theme.',
  }),
  font: z.enum(['inter', 'manrope', 'system'], {
    invalid_type_error: 'Select a font',
    required_error: 'Please select a font.',
  }),
});

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<AppearanceFormValues> = {
  theme: 'light',
};

export function AppearanceForm() {
  const form = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues,
  });

  function onSubmit(data: AppearanceFormValues) {
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="font"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Font</FormLabel>
              <div className="relative w-max">
                <FormControl>
                  <select
                    className={cn(
                      buttonVariants({ variant: 'outline' }),
                      'w-[200px] appearance-none bg-transparent font-normal',
                    )}
                    {...field}
                  >
                    <option value="inter">Inter</option>
                    <option value="manrope">Manrope</option>
                    <option value="system">System</option>
                  </select>
                </FormControl>
                <ChevronDownIcon className="absolute right-3 top-2.5 h-4 w-4 opacity-50" />
              </div>
              <FormDescription>Set the font you want to use in the dashboard.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Theme</FormLabel>
              <FormDescription>Select the theme for the dashboard.</FormDescription>
              <FormMessage />
              <RadioGroup
                onValueChange={(e: 'dark' | 'light') => field.onChange(e)}
                defaultValue={field.value}
                className="grid max-w-md grid-cols-2 gap-8 pt-2"
              >
                <FormItem>
                  <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                    <FormControl>
                      <RadioGroupItem value="light" className="sr-only" />
                    </FormControl>
                    <div className="border-muted hover:border-accent items-center rounded-md border-2 p-1">
                      <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                        <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                          <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                          <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                        </div>
                        <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                          <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                          <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                        </div>
                        <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                          <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                          <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                        </div>
                      </div>
                    </div>
                    <span className="block w-full p-2 text-center font-normal">Light</span>
                  </FormLabel>
                </FormItem>
                <FormItem>
                  <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                    <FormControl>
                      <RadioGroupItem value="dark" className="sr-only" />
                    </FormControl>
                    <div className="border-muted bg-popover hover:bg-accent hover:text-accent-foreground items-center rounded-md border-2 p-1">
                      <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                        <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                          <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                          <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                        </div>
                        <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                          <div className="h-4 w-4 rounded-full bg-slate-400" />
                          <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                        </div>
                        <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                          <div className="h-4 w-4 rounded-full bg-slate-400" />
                          <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                        </div>
                      </div>
                    </div>
                    <span className="block w-full p-2 text-center font-normal">Dark</span>
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormItem>
          )}
        />

        <Button type="submit">Update preferences</Button>
      </form>
    </Form>
  );
}
