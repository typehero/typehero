import { test as setup } from '@playwright/test';
import { prisma } from '@repo/db';
import { addMonths } from 'date-fns';
import { USER } from './constant';

setup('unauthenticated', async ({ page }) => {
  await page.context().storageState({ path: 'playwright/.auth/unauthenticated.json' });
});

setup('authenticate user', async ({ page }) => {
  const expires = addMonths(new Date(), 1);

  await prisma.user.upsert({
    where: {
      email: USER.email,
    },
    create: {
      id: USER.id,
      name: 'user',
      email: USER.email,
      sessions: {
        create: {
          expires,
          sessionToken: USER.sessionToken,
        },
      },
      roles: {
        create: {
          role: 'USER',
        },
      },
      accounts: {
        create: {
          type: 'oauth',
          provider: 'github',
          providerAccountId: '12345678',
          access_token: 'gho_abcd',
          token_type: 'bearer',
          scope: 'read:user,user:email',
        },
      },
    },
    update: {
      sessions: {
        update: {
          where: {
            sessionToken: USER.sessionToken,
          },
          data: {
            expires,
          },
        },
      },
    },
  });

  await page.context().addCookies([
    {
      name: 'next-auth.session-token',
      value: USER.sessionToken,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      sameSite: 'Lax',
      expires: Math.floor(expires.getTime() / 1000),
    },
  ]);

  await page.context().storageState({ path: 'playwright/.auth/user.json' });
});
