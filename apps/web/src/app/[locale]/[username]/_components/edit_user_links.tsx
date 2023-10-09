"use client";

import { z } from "zod";
import type { UserProfile } from "./profile.actions";
import { MagicIcon } from "@repo/ui/components/magic-icon";
import { createNoProfanitySchemaWithValidate } from "~/utils/antiProfanityZod";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "@repo/ui/components/use-toast";
import { Dialog, DialogContent, DialogHeader } from "@repo/ui/components/dialog";
import { Form, FormItem } from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { Button } from "@repo/ui/components/button";

interface EditUserLinksProps {
  publicUser: NonNullable<UserProfile>;
  updateData: Function;
}

const UserLinkSchema = z.object({
  userLinks: z.array(
    z.object({
      url: z.union([
        createNoProfanitySchemaWithValidate((str) => str.url().min(1).max(256)),
        z.literal(''),
      ]),
    }),
  ),
});
export type UserLinkSchemaType = z.infer<typeof UserLinkSchema>;

export const EditUserLinks = ({ publicUser, updateData }: EditUserLinksProps) => {
  const [editLinksDialogOpen, setEditLinksDialogOpen] = useState(false);
  const userLinkForm = useForm<UserLinkSchemaType>({
    resolver: zodResolver(UserLinkSchema),
    defaultValues: {
      userLinks: [
        ...publicUser.userLinks,
      ]
    },
    mode: "onChange",
  });
  const userLinks = useWatch({ control: userLinkForm.control, name: 'userLinks' });
  const userLinkFormFields = useFieldArray<UserLinkSchemaType>({
    control: userLinkForm.control,
    name: 'userLinks',
  });

  async function onUserLinkSubmit(data: UserLinkSchemaType) {
    try {
      await updateData(data);
      toast({
        variant: "success",
        description: "Your links were successfully updated."
      });
    }
    catch (e) {
      console.log(e);
      toast({
        variant: "destructive",
        description: "An error occured while trying to update links."
      });
    }
    finally {
      setEditLinksDialogOpen(false);
    }
  }

  return (
    <>
      <div className='flex flex-row items-center'>
        <Button variant={'outline'} className="w-full" onClick={() => {
          setEditLinksDialogOpen(true);
        }}>
          <span className='text-sm'>Edit Links</span>
        </Button>
      </div>
      <Dialog open={editLinksDialogOpen} onOpenChange={() => {
        setEditLinksDialogOpen(!editLinksDialogOpen);
      }}>
        <DialogContent>
          <DialogHeader>
            Public Links
          </DialogHeader>
          <Form {...userLinkForm}>
            <form className="flex flex-col gap-4" autoComplete="off" onSubmit={userLinkForm.handleSubmit(onUserLinkSubmit)}>
              <div className='flex flex-col space-y-2'>
                {userLinkFormFields.fields.map((val, i) => {
                  return (
                    <FormItem className="flex-col" key={`url-link-${i}`}>
                      <div className="flex items-center space-y-2">
                        <MagicIcon className="mr-2" url={userLinks[i]?.url ?? ''} />
                        <Input
                          defaultValue={val.url}
                          placeholder="Link to social profile"
                          {...userLinkForm.register(`userLinks.${i}.url`)}
                        />
                      </div>
                      {userLinkForm.formState.errors.userLinks?.[i]?.url?.message ? (
                        <div className="text-sm text-destructive">{userLinkForm.formState.errors.userLinks[i]?.url?.message}</div>
                      ) : null}
                    </FormItem>
                  );
                })}
              </div>
              <Button variant={'secondary'} type="button" disabled={userLinks.length === 4}  onClick={() => {
                if (userLinks.length <= 4) {
                  userLinkForm.setValue("userLinks", [
                    ...userLinks,
                    {
                      url: ""
                    }
                  ])
                }
                return;
              }}>
                Add Field
              </Button>
              <Button className='w-full' type="submit">
                Update
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
