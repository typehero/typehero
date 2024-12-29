import React from 'react';
import Bulb from './Bulb';

export default function Strip({ delay }: { delay: number }) {
  return (
    <div
      className="animate-slidedown group flex h-full w-full flex-col items-center justify-center px-2 odd:-translate-y-0 even:translate-y-12 even:-scale-x-100"
      style={
        {
          '--delay': `${delay}s`,
        } as React.CSSProperties
      }
    >
      {[...Array(14)].map((_, i) => (
        <Bulb key={i} />
      ))}
    </div>
  );
}
