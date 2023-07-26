'use client';

import { useWatch } from 'react-hook-form';
import type { WizardForm } from '.';
import type { ExploreChallengeData } from '../explore';
import { ExploreCard } from '../explore/explore-card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { TypographyH3 } from '../ui/typography/h3';

interface Props {
  form: WizardForm;
}

export function ChallengeCardEditor({ form }: Props) {
  const difficulty = useWatch({ control: form.control, name: 'difficulty' });
  const title = useWatch({ control: form.control, name: 'name' });
  const shortDescription = useWatch({ control: form.control, name: 'shortDescription' });

  const data: Pick<
    ExploreChallengeData[0],
    'difficulty' | 'name' | 'shortDescription' | 'user' | '_count' | 'updatedAt'
  > = {
    difficulty,
    name: title || 'Your Title Here',
    shortDescription: shortDescription || 'Your Short Description Here',
    user: {
      name: 'You',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
    _count: {
      vote: 100,
      comment: 50,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
    updatedAt: new Date(),
  };
  return (
    <div className="h-full py-6">
      <TypographyH3 className="mb-6">Create Challenge Card</TypographyH3>
      <div className="flex items-start gap-12">
        <div className="flex w-1/3 flex-col gap-3">
          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Select
                    onValueChange={field.onChange as (value: string) => void}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a difficulty for your challenge" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="BEGINNER">BEGINNER</SelectItem>
                      <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                      <SelectItem value="HARD">HARD</SelectItem>
                      <SelectItem value="EXTREME">EXTREME</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Challenge Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter a Challenge Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="shortDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Short Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter a Short Description"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="w-[392px]">
          <ExploreCard challenge={data} />
        </div>
      </div>
    </div>
  );
}
