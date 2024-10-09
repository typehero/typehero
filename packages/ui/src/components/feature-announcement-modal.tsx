'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from '../icons';
import { Button } from './button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './dialog';

interface FeatureItem {
  title: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
}

const features: FeatureItem[] = [
  {
    title: 'Mentions',
    description: 'You can now mention community members in comments.',
    videoUrl: 'https://utfs.io/f/b980d6eb-fb8b-4743-b2df-86a26b43fdf3-xi1x00.mp4',
  },
  {
    title: 'Notifications',
    description: 'Stay engaged in conversations across the platform.',
    videoUrl: 'https://utfs.io/f/0a43b20f-c283-4eac-9360-0c7bd4ce8a50-l1iync.mp4',
  },
];

/**
 * MVP: just show content as needed with a hardcoded key and slides
 */
export function FeatureAnnouncementModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);

  useEffect(() => {
    const hasSeenAnnouncement = localStorage.getItem('hasSeenFeatureAnnouncement');
    if (!hasSeenAnnouncement) {
      setIsOpen(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenFeatureAnnouncement', 'true');
  };

  const handlePrevious = () => {
    setCurrentFeatureIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : features.length - 1));
  };

  const handleNext = () => {
    setCurrentFeatureIndex((prevIndex) => (prevIndex < features.length - 1 ? prevIndex + 1 : 0));
  };

  const currentFeature = features[currentFeatureIndex]!;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        onPointerDownOutside={() => {
          localStorage.setItem('hasSeenFeatureAnnouncement', 'true');
        }}
        displayX={false}
        className="max-h-[90vh] overflow-y-auto sm:max-w-[550px] sm:rounded-sm"
      >
        <DialogHeader>
          <DialogTitle>New Features!</DialogTitle>
          <DialogDescription>
            We've added some amazing new features to enhance your experience:
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 text-center">
          <div className="relative mb-4 h-[300px] w-full">
            <video
              preload="none"
              loop
              muted
              autoPlay
              playsInline
              className="h-full w-full object-cover"
              src={currentFeature.videoUrl}
            />
            <Button
              variant="outline"
              onClick={handlePrevious}
              aria-label="Previous feature"
              className="bg-background/40 hover:bg-background/80 absolute left-2 top-1/2 -translate-y-1/2 transform border-none focus-visible:ring-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={handleNext}
              aria-label="Next feature"
              className="bg-background/40 hover:bg-background/80 absolute right-2 top-1/2 -translate-y-1/2 transform border-none focus-visible:ring-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <h3 className="mb-2 text-lg font-semibold">{currentFeature.title}</h3>
          <p className="text-muted-foreground text-sm">{currentFeature.description}</p>
        </div>
        <div className="mt-4 flex items-center justify-center">
          <div className="flex space-x-2">
            {features.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full ${
                  index === currentFeatureIndex ? 'bg-primary' : 'bg-muted'
                }`}
                onClick={() => setCurrentFeatureIndex(index)}
                aria-label={`Go to feature ${index + 1}`}
                aria-current={index === currentFeatureIndex ? 'true' : 'false'}
              />
            ))}
          </div>
        </div>
        <DialogFooter>
          <div
            onClick={handleDismiss}
            role="button"
            className="rounded-full bg-gradient-to-r from-[#31bdc6] to-[#3178c6] p-[1px] brightness-90 contrast-150 dark:brightness-125 dark:contrast-100"
          >
            <div className="rounded-full bg-white/80 px-3 py-1 dark:bg-black/80">
              <span className="flex select-none items-center justify-center bg-gradient-to-r from-[#31bdc6] to-[#3178c6] bg-clip-text text-transparent">
                <span>Got it, thanks!</span>
              </span>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
