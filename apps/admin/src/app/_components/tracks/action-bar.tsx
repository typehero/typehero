'use client';

import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@repo/ui';
import { useState } from 'react';
import { AddTrackForm } from './add-track-form';

export function ActionBar() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex w-full flex-row-reverse items-center py-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost">Add Track</Button>
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
