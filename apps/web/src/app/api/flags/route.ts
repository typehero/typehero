import { NextResponse } from 'next/server';
import { getAllFlags } from '~/utils/feature-flags';

export async function GET() {
  const flags = await getAllFlags();
  return NextResponse.json(flags);
}
