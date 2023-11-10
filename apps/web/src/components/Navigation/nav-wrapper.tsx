'use client';

import { usePathname } from 'next/navigation';
import { useFullscreenSettingsStore } from '~/app/[locale]/challenge/_components/fullscreen';

export function NavWrapper({ children }: { children: React.ReactNode }) {
  const { fssettings } = useFullscreenSettingsStore();
  const pathname = usePathname();

  if (fssettings.isFullscreen) return <></>;

  return (
    <nav
      className={`flex h-14 items-center text-sm font-medium ${
        pathname?.startsWith('/challenge') ? 'px-4' : 'container'
      }`}
    >
      {children}
    </nav>
  );
}
