import { ThemeProvider } from 'next-themes';

import { Inter } from 'next/font/google';

import { ClerkProvider } from '@clerk/nextjs';

import { type AppType } from 'next/app';
import '~/styles/globals.css';
import { api } from '~/utils/api';

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ['latin'] });

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <ThemeProvider attribute="class">
        <main className={`${inter.className} bg-white dark:bg-neutral-950`}>
          <Component {...pageProps} />
        </main>
      </ThemeProvider>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
