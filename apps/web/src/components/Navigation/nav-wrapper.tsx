'use client';

import { usePathname } from 'next/navigation';
import { useFullscreenSettingsStore } from '~/components/fullscreen-button';

export function NavWrapper({ children }: { children: React.ReactNode }) {
  const { fssettings } = useFullscreenSettingsStore();
  const _pathname = usePathname();

  if (fssettings.isFullscreen) return null;

  return <nav className="container flex h-14 items-center text-sm font-medium">{children}</nav>;
}
