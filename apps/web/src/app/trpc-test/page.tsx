import { TRPCTest } from '~/components/trpc-test';
import { TRPCServerTest } from '~/components/trpc-server-test';

export default function TRPCTestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">tRPC Integration Test</h1>
      <div className="max-w-md mx-auto">
        <TRPCTest />
        <TRPCServerTest />
      </div>
    </div>
  );
}