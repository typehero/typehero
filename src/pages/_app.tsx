import { type Session } from 'next-auth';

import { SessionProvider } from 'next-auth/react';

import { ThemeProvider } from 'next-themes';

import { Inter } from 'next/font/google';

import { type AppType } from 'next/app';
import '~/styles/globals.css';
import { api } from '~/utils/api';

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ['latin'] });

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <ThemeProvider attribute="class">
      <SessionProvider session={session}>
        <main className={`${inter.className} bg-white dark:bg-neutral-900`}>
          <Component {...pageProps} />
        </main>
      </SessionProvider>
    </ThemeProvider>
  );
};

export default api.withTRPC(MyApp);
