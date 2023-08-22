import NextAuth from '@repo/auth/next-auth';
import { authOptions } from '@repo/auth/server';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
