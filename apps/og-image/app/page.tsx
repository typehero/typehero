'use client';

import Head from 'next/head';
import { useEffect, useState } from 'react';
import { challengeParam, userParam } from 'utils/zodParams';
import './app.css';

const ogImageUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/api/landing` : '';

export default function Page() {
  const [nonce, setNonce] = useState(Math.random());

  useEffect(() => {
    // randomize nonce on window focus
    const handleFocus = () => setNonce(Math.random());
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  return (
    <div>
      <Head>
        <meta name="og:title" content="typehero OG Image Playground" />
        <meta
          name="og:description"
          content="Playground for OG Image Generation using @vercel/og-image"
        />
        <meta name="og:image" content={ogImageUrl} />
        <meta data-rh="true" name="twitter:image" content={ogImageUrl} />
      </Head>
      <main className="grid grid-flow-row grid-cols-2">
        <div>
          <h2>Challenge Card</h2>
          <img
            alt="ayo"
            src={`/api/challenge?${challengeParam.toSearchString({
              description: 'This is a test card that has a has a nice description',
              title: 'Inferring types is fun',
              username: 'Hacksore',
              date: new Date().toISOString(),
            })}&random=${nonce}`}
          />
        </div>

        <div>
          <h2>User</h2>
          <img
            alt="ayo"
            src={`/api/user?${userParam.toSearchString({
              username: 'Hacksore',
            })}&random=${nonce}`}
          />
        </div>
        <div>
          <h2>Default</h2>
          <img alt="default metadata" src="/api/default" />
        </div>
      </main>
    </div>
  );
}
