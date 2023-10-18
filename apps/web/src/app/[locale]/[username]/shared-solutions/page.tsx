import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { InProgressTab } from '../_components/dashboard/in-progress-tab';
import { SharedSolutionsTab } from '../_components/dashboard/shared-solutions-tab';

export default function SharedSolutionsPage() {
  return (
    <Card className="col-span-4 md:min-h-[calc(100vh_-_56px_-_6rem)]">
      <CardHeader>
        <CardTitle>Shared Solutions</CardTitle>
        <CardDescription className="text-muted-foreground mb-4 text-sm">
          {/* {isOwnProfile ? 'Your' : `${user.name}'s`} shared challenge solutions. */}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SharedSolutionsTab userId={'1'} />
      </CardContent>
    </Card>
  );
}
