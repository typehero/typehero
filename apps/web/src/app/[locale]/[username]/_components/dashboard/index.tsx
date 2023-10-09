import { type UserPrivateProfile, type UserProfile } from '../profile.actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/tabs";
import { ProfileOverview } from '../overview';
import { ProfilePane } from '../profile_pane';
import { Bookmarks } from '../bookmarks';

interface Props {
  publicUser: NonNullable<UserProfile>; // null case is already handled in the parent component.
  privateUser: UserPrivateProfile;
}

export async function Dashboard({ publicUser, privateUser }: Props) {
  return (
    <div className="container flex flex-col md:flex-row h-full">
      <ProfilePane publicUser={publicUser} privateUser={privateUser} />
      <div className='flex flex-col md:w-3/4 space-y-4 pt-5'>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className='flex flex-wrap h-fit justify-start bg-popover'>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {
              privateUser !== null ? (
                <>
                  <TabsTrigger value="challenges">Challenges</TabsTrigger>
                  <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                </>
              ) : null
            }
          </TabsList>
          {
            publicUser ? (
              <TabsContent value='overview'>
                <ProfileOverview publicUser={publicUser} />
              </TabsContent>
            ) : null
          }
          {
            privateUser !== null ? (
              <TabsContent value='bookmarks'>
                <Bookmarks privateUser={privateUser} />
              </TabsContent>
            ) : null
          }
        </Tabs>
      </div>
    </div >
  );
}

