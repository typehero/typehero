import { Session } from "@repo/auth/client";
import type { DefaultSession } from "@repo/auth/server";
import type { Role, RoleTypes } from '@repo/db'

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: DefaultSession['user'] & {
      id: string;
      role: RoleTypes[];
    };
  }

  interface User {
    createdAt: Date;
    roles: Role[];
  }
}
