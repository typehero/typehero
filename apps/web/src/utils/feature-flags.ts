import { createClient } from '@vercel/edge-config';

export const mockFlags = {
  enableLogin: true,
  enableExplore: true,
  enableTracks: true,
  enableEarlyAccess: true,
};

export async function getAllFlags() {
  const allFeatureFlag = process.env.EDGE_CONFIG
    ? await createClient(process.env.EDGE_CONFIG).getAll<typeof mockFlags>()
    : mockFlags;
  return allFeatureFlag;
}
