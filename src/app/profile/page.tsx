import Head from 'next/head';

export default async function Profile() {
  return (
    <div>
      <Head>
        <title>Type Hero - Profile</title>
      </Head>
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-center text-2xl text-white">Profile</p>
      </div>
    </div>
  );
}
