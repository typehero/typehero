'use client';

import { api } from '~/trpc/react';

export function TRPCTest() {
  const { data: hello, isLoading } = api.user.hello.useQuery({ name: 'TypeHero' });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!hello) {
    return <div>No data received</div>;
  }

  return (
    <div className="border p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-2">tRPC Test - Hello World</h2>
      <p>Greeting: {hello.greeting}</p>
      <p>Timestamp: {hello.timestamp}</p>
      <p className="text-sm text-green-600 mt-2">✅ tRPC is working!</p>
    </div>
  );
}