import { createClient, type EdgeConfigItems } from '@vercel/edge-config';

const edgeConfig = createClient(process.env.EDGE_CONFIG);
/**
 * This will try to eval a feature flag on the prod app
 *
 * @example
 * ```
 * const isFeatureEnabled = await evaluateFlag('my-feature-flag');
 * ```
 */
export async function evaluateFlag(key: string): Promise<boolean> {
  const featureFlag = await edgeConfig.get(key);

  const rawValue = featureFlag?.valueOf();
  return rawValue == true;
}

export async function getAllFlags(): Promise<EdgeConfigItems> {
  const allFeatureFlag = await edgeConfig.getAll();
  return allFeatureFlag;
}
