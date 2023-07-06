import { get } from '@vercel/edge-config';

const MARKETING_MODE_FLAG = 'marketing';

/**
 * Returns true if the feature flag is enabled.
 */
export const isMarketing = async () => {
  const featureFlagEnabled = await get(MARKETING_MODE_FLAG);

  return featureFlagEnabled !== undefined;
};
