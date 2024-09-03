'use client';

import { usePathname } from 'next/navigation';
import { useFullscreenSettingsStore } from '~/app/challenge/_components/fullscreen';

export function NavWrapper({ children }: { children: React.ReactNode }) {
  const { fssettings } = useFullscreenSettingsStore();
  const pathname = usePathname();

  if (fssettings.isFullscreen) return <></>;

  return (
    <nav
      className={`flex h-14 items-center font-medium text-sm ${
        pathname?.startsWith('/challenge') ? 'px-4' : 'container'
      }`}
    >
      {children}
    </nav>
  );
}
