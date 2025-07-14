import { api } from '~/trpc/server';

export async function TRPCServerTest() {
  // This demonstrates server-side tRPC usage - this would only work with a logged-in user
  // For now, let's create a simple component that shows the concept
  
  return (
    <div className="border p-4 rounded-lg mt-4">
      <h2 className="text-xl font-bold mb-2">tRPC Server-Side Test</h2>
      <p>This component demonstrates server-side tRPC usage.</p>
      <p className="text-sm text-gray-600 mt-2">
        Server-side calls would be made using: <code>await api.user.getProfile()</code>
      </p>
    </div>
  );
}