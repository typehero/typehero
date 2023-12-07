'use client';
import { usePathname } from 'next/navigation';

export const SkipToCodeEditor = () => {
  const pathname = usePathname();

  if (!pathname.includes('challenge')) {
    return null;
  }

  return (
    <a href="#code-editor" className="sr-only focus:static focus:h-auto focus:w-auto">
      Skip to code editor
    </a>
  );
};
