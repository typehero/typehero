import { type UserPrivateProfile, type UserProfile } from '../profile.actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/tabs';
import { ProfileOverview } from '../overview';
import { ProfilePane } from '../profile_pane';
import { Bookmarks } from '../bookmarks';

interface Props {
  publicUser: NonNullable<UserProfile>; // null case is already handled in the parent component.
  privateUser: UserPrivateProfile;
}

export async function Dashboard({ publicUser, privateUser }: Props) {
  return (
    <div className="container flex h-full flex-col md:flex-row">
      <ProfilePane publicUser={publicUser} privateUser={privateUser} />
      <div className="flex flex-col space-y-4 pt-5 md:w-3/4">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-popover flex h-fit flex-wrap justify-start">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {privateUser !== null ? (
              <>
                <TabsTrigger value="challenges">Challenges</TabsTrigger>
                <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </>
            ) : null}
          </TabsList>
          {publicUser ? (
            <TabsContent value="overview">
              <ProfileOverview publicUser={publicUser} />
            </TabsContent>
          ) : null}
          {privateUser !== null ? (
            <TabsContent value="bookmarks">
              <Bookmarks privateUser={privateUser} />
            </TabsContent>
          ) : null}
        </Tabs>
      </div>
    </div>
  );
}
