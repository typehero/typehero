'use client';
import { ArrowUp, MessageCircle, Plus } from 'lucide-react';

import { Button } from '~/components/ui/button';
import { TypographyH3 } from '../ui/typography/h3';
import type { Challenge } from '.';

interface Props {
  challenge: NonNullable<Challenge>;
}
export function Solutions({ challenge }: Props) {
  const hasSolution = challenge.Solution?.length > 0;

  const handleClick = () => {
    console.log('do stuff');
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-end">
        <Button className="bg-green-400" onClick={handleClick} disabled={!hasSolution}>
          <Plus className="mr-2 h-4 w-4" /> Solution
        </Button>
      </div>
      <div>{/* <SolutionRow /> */}</div>
    </div>
  );
}

function SolutionRow() {
  const date = new Date();
  return (
    <div className="p-4 hover:bg-gray-600">
      <TypographyH3>Some Title</TypographyH3>
      <div className="flex gap-2">
        <div>username goes here</div>
        <div>{date.toLocaleString()}</div>
      </div>
      <div className="flex gap-2">
        <div className="flex">
          <ArrowUp /> 69
        </div>
        <div className="flex">
          <MessageCircle /> 69
        </div>
      </div>
    </div>
  );
}
