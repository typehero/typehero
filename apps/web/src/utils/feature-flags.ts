import { createClient, type EdgeConfigItems } from '@vercel/edge-config';

const mockFlags = {
  loginButton: true,
  exploreButton: true,
  tracksButton: true,
};

/**
 * This will try to eval a feature flag on the prod app
 *
 * @example
 * ```
 * const isFeatureEnabled = await evaluateFlag('my-feature-flag');
 * ```
 */
export async function evaluateFlag(key: string): Promise<boolean> {
  if (!process.env.EDGE_CONFIG) {
    return mockFlags[key as keyof typeof mockFlags];
  }
  const edgeConfig = createClient(process.env.EDGE_CONFIG);

  const featureFlag = await edgeConfig.get(key);

  const rawValue = featureFlag?.valueOf();
  return rawValue == true;
}

export async function getAllFlags(): Promise<EdgeConfigItems> {
  const allFeatureFlag = process.env.EDGE_CONFIG
    ? await createClient(process.env.EDGE_CONFIG).getAll()
    : mockFlags;
  return allFeatureFlag;
}
