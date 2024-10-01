'use client';

import { usePathname } from 'next/navigation';
import { useFullscreenSettingsStore } from '~/components/fullscreen-button';

export function NavWrapper({ children }: { children: React.ReactNode }) {
  const { fssettings } = useFullscreenSettingsStore();
  const pathname = usePathname();

  if (fssettings.isFullscreen) return <></>;

  const shouldBeFullWidth = pathname?.startsWith('/challenge') || pathname?.startsWith('/play');

  return (
    <nav
      className={`flex h-14 items-center text-sm font-medium ${
        shouldBeFullWidth ? 'px-4' : 'container'
      }`}
    >
      {children}
    </nav>
  );
}
