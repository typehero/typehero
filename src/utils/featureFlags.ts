import { createClient } from '@vercel/edge-config';
import { env } from '../env.mjs';

interface FeatureFlags {
  // The mode the site is running in
  mode: 'marketing' | 'production';
}

// We use prefixes to avoid mixing up the flags with other Edge Config values
const prefixKey = (key: string) => `ff_${key}`;
// export async function get(key: keyof FeatureFlags) {
//   const prefixedKey = prefixKey(key);
//   const edgeConfig = createClient(env.EDGE_CONFIG);
//   const featureFlag = await edgeConfig.get<FeatureFlags>(prefixedKey);
//   return featureFlag;
// }

// For now we use this since it is a simp build time thingy
export function isProd() {
  return process.env.NODE_ENV === 'production';
}
