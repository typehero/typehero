import { cn } from '@repo/ui/cn';
import Image from 'next/image';
import Link from 'next/link';

export function BootPromo({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <Link
        href="https://www.boot.dev/tracks/backend-python-typescript"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          src="/boot-logo.png"
          alt="Boot.dev Logo"
          width={300}
          height={30}
          className="object-contain"
        />
      </Link>
      <p className="text-muted-foreground text-sm font-medium">
        Learn Backend Development in TypeScript
      </p>
    </div>
  );
}
