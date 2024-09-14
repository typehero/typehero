import { Button } from '@repo/ui/components/button';
import { ArrowLeft } from '@repo/ui/icons';
import Link from 'next/link';

export default function SharedSolutionPage() {
  return (
    <div className="w-full space-y-4">
      <Button asChild variant="ghost" size="sm">
        <Link href="../v2">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Profile
        </Link>
      </Button>
      <div className="space-y-2">
        <h1 className="text-lg font-bold">Shared Solutions</h1>
      </div>
    </div>
  );
}
