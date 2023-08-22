// TODO: fix the import paths
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// TODO: THIS HAS TO BE REMOVED
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  // TODO: remove this default email
  const to = searchParams.get('to') ?? 'sean@boult.me';

  try {
    return NextResponse.json(sendUserSignupEmail(to));
  } catch (error) {
    return NextResponse.json({ error });
  }
}
