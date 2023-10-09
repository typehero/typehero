'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/components/button';
import { Dialog, DialogContent, DialogHeader } from '@repo/ui/components/dialog';
import { Form, FormField, FormItem, FormMessage } from '@repo/ui/components/form';
import { toast } from '@repo/ui/components/use-toast';
import { Pencil } from '@repo/ui/icons';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { RichMarkdownEditor } from '~/components/rich-markdown-editor';
import type { UserProfile } from './profile.actions';

interface EditUserBioProps {
  publicUser: NonNullable<UserProfile>;
  updateData: (data: UserBioSchemaType) => Promise<void>;
}

const UserBioSchema = z.object({
  bio: z.string().min(1).max(65535),
});
export type UserBioSchemaType = z.infer<typeof UserBioSchema>;

export const EditUserBio = ({ publicUser, updateData }: EditUserBioProps) => {
  const [editBioDialogOpen, setEditBioDialogOpen] = useState(false);
  const userBioForm = useForm<UserBioSchemaType>({
    resolver: zodResolver(UserBioSchema),
    defaultValues: {
      bio: publicUser.bio ?? '',
    },
    mode: 'onChange',
  });

  async function onUserBioSubmit(data: UserBioSchemaType) {
    try {
      await updateData(data);
      toast({
        variant: 'success',
        description: 'Your bio was successfully updated.',
      });
    } catch (e) {
      console.log(e);
      toast({
        variant: 'destructive',
        description: 'An error occured while trying to update you bio.',
      });
    } finally {
      setEditBioDialogOpen(false);
    }
  }

  return (
    <>
      <Button
        size="sm"
        className="bg-secondary/60 hover:bg-secondary/90 text-muted-foreground w-fit"
        onClick={() => {
          setEditBioDialogOpen(true);
        }}
      >
        <Pencil size={18} />
      </Button>
      <Dialog
        open={editBioDialogOpen}
        onOpenChange={() => {
          setEditBioDialogOpen(!editBioDialogOpen);
        }}
      >
        <DialogContent>
          <DialogHeader>Public Bio</DialogHeader>
          <Form {...userBioForm}>
            <form
              className="flex flex-col gap-4"
              autoComplete="off"
              onSubmit={userBioForm.handleSubmit(onUserBioSubmit)}
            >
              <div className="flex flex-col space-y-2">
                <FormField
                  control={userBioForm.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem className="h-[300px] w-full">
                      <RichMarkdownEditor onChange={field.onChange} value={field.value} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button className="w-full" type="submit">
                Update
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
