'use client';

import { UseFormReturn, useWatch } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { DifficultyBadge } from '../ui/difficulty-badge';
import { MessageCircle, ThumbsUp } from 'lucide-react';
import { Button } from '../ui/button';
import { getRelativeTime } from '~/utils/relativeTime';
import ExploreCard from '../explore/explore-card';
import { ExploreChallengeData } from '../explore';

interface Props {
  form: UseFormReturn<
    {
      title: string;
      prompt: string;
      difficulty: 'BEGINNER' | 'EASY' | 'MEDIUM' | 'HARD' | 'EXTREME';
      description: string;
      shortDescription: string;
    },
    any,
    undefined
  >;
}

export function ChallengeCardEditor({ form }: Props) {
  const difficulty = useWatch({ control: form.control, name: 'difficulty' });
  const title = useWatch({ control: form.control, name: 'title' });
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
    } as any,
    _count: {
      vote: 100,
    } as any,
    updatedAt: new Date(),
  };
  return (
    <div className="flex items-center gap-12 p-6">
      <div className="flex w-1/3 flex-col gap-3">
        <FormField
          control={form.control}
          name="difficulty"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <Select onValueChange={field.onChange as any} defaultValue={field.value}>
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
          name="title"
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
  );
}
