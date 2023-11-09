'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/dialog';
import { Button } from '@repo/ui/components/button';
import { useState } from 'react';
import { AddTrackForm } from './add-track-form';

export function ActionBar() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex w-full flex-row-reverse items-center pb-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Add Track</Button>
        </DialogTrigger>
        <DialogContent className="w-[200px]">
          <DialogHeader>
            <DialogTitle>Add a Track</DialogTitle>
          </DialogHeader>
          <div className="pt-4">
            <AddTrackForm toggle={setOpen} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
