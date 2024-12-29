'use client';
import { useEffect, useRef } from 'react';

const colors = [
  'bg-red-500',
  'bg-yellow-500',
  'bg-green-500',
  'bg-blue-500',
  'bg-indigo-500',
  'bg-purple-500',
  'bg-pink-500',
];

export default function Bulb() {
  const bulb = useRef<HTMLDivElement>(null);
  const randomSpacing = Math.random() * 2;

  useEffect(() => {
    const interval = setInterval(() => {
      bulb.current?.classList.toggle('animate-bulb');
      bulb.current?.classList.toggle('odd:[animation-delay:0.25s]');
      bulb.current?.classList.toggle('odd:[animation-delay:1s]');
      bulb.current?.classList.toggle('animate-bulb-slow');
    }, 4000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <div
      ref={bulb}
      className="animate-bulb relative p-8 odd:ml-8 odd:[animation-delay:0.25s] even:mr-8"
      style={{
        transform: `translateX(${randomSpacing}rem) translateY(${-randomSpacing}rem)`,
      }}
    >
      <div
        className={`${
          colors[Math.round(Math.random() * 7)]
        } h-2 w-2 rounded-full bg-white/30 blur-sm duration-75 group-hover:scale-150`}
      />
      <div className="absolute inset-0 m-auto h-0.5 w-0.5 rounded-full bg-white/40" />
    </div>
  );
}
