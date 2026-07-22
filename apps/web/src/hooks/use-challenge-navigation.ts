import { usePathname } from 'next/navigation';
import { DIFFICULTIES } from '~/constants/difficulties';

export function useChallengeNavigation() {
  const pathname = usePathname();

  const isActive = pathname.startsWith('/challenge');

  const challengeLinks = [
    { href: '/challenge', label: 'All Challenges' },
    ...DIFFICULTIES.map((difficulty) => ({
      href: `/explore/${difficulty.tag.toLowerCase()}`,
      label: difficulty.label,
    })),
  ];

  // Validate that we have the expected data
  if (!DIFFICULTIES) {
    console.warn('useChallengeNavigation: DIFFICULTIES is undefined');
    return {
      isActive,
      challengeLinks: [{ href: '/challenge', label: 'All Challenges' }],
    };
  }

  return {
    isActive,
    challengeLinks,
  };
}
