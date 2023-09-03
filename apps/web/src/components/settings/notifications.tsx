'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { User } from '@repo/db/types';
import {
  Button,
  Card,
  Checkbox,
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
  Switch,
  Tabs,
  VerticalTabsContent,
  VerticalTabsList,
  VerticalTabsTrigger,
  toast,
} from '@repo/ui';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import UserHeader from '~/components/user/dashboard/user-header';
import { getRelativeTime } from '~/utils/relativeTime';
import { links } from './new-settings';

interface Props {
  user: User & { userLinks: { id: string | null; url: string }[] };
}

export const Notification = ({ user }: Props) => {
  return (
    <div className="container">
      <Tabs className="flex flex-col gap-8 py-8 md:flex-row" defaultValue="notifications">
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
        <VerticalTabsContent className="shrink grow space-y-4" value="notifications">
          <Card className="col-span-4 min-h-[calc(100vh_-_56px_-_6rem)]">
            <Notifications />
          </Card>
        </VerticalTabsContent>
      </Tabs>
    </div>
  );
};

function Notifications() {
  return (
    <div className="max-w-lg space-y-6 p-8">
      <div className="mb-4">
        <h3 className="text-lg font-medium">Notifications</h3>
        <p className="text-muted-foreground mb-4 text-sm">
          Configure how you receive notifications.
        </p>
        <Separator />
      </div>
      <NotificationsForm />
    </div>
  );
}

const notificationsFormSchema = z.object({
  type: z.enum(['all', 'mentions', 'none'], {
    required_error: 'You need to select a notification type.',
  }),
  mobile: z.boolean().default(false).optional(),
  communication_emails: z.boolean().default(false).optional(),
  social_emails: z.boolean().default(false).optional(),
  marketing_emails: z.boolean().default(false).optional(),
  security_emails: z.boolean(),
});

type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<NotificationsFormValues> = {
  communication_emails: false,
  marketing_emails: false,
  social_emails: true,
  security_emails: true,
};

export function NotificationsForm() {
  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues,
  });

  async function onSubmit(data: NotificationsFormValues) {
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
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Notify me about...</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(e: 'all' | 'mentions' | 'none') => field.onChange(e)}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="all" />
                    </FormControl>
                    <FormLabel className="font-normal">All new messages</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="mentions" />
                    </FormControl>
                    <FormLabel className="font-normal">Direct messages and mentions</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="none" />
                    </FormControl>
                    <FormLabel className="font-normal">Nothing</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <h3 className="mb-4 text-lg font-medium">Email Notifications</h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="communication_emails"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Communication emails</FormLabel>
                    <FormDescription>Receive emails about your account activity.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="marketing_emails"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Marketing emails</FormLabel>
                    <FormDescription>
                      Receive emails about new products, features, and more.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="social_emails"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Social emails</FormLabel>
                    <FormDescription>
                      Receive emails for friend requests, follows, and more.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="security_emails"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Security emails</FormLabel>
                    <FormDescription>
                      Receive emails about your account activity and security.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled
                      aria-readonly
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <FormField
          control={form.control}
          name="mobile"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(e: boolean) => field.onChange(e)}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Use different settings for my mobile devices</FormLabel>
                <FormDescription>
                  You can manage your mobile notifications in the{' '}
                  <Link href="/examples/forms">mobile settings</Link> page.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <Button type="submit">Update notifications</Button>
      </form>
    </Form>
  );
}
