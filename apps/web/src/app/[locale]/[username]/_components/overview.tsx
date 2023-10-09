import { Card, CardContent, CardHeader } from "@repo/ui/components/card";
import { updateUserBio, type UserProfile } from "./profile.actions";
import { Markdown } from "@repo/ui/components/markdown";
import { Heart, Pencil } from "@repo/ui/icons";
import { getRelativeTime } from "~/utils/relativeTime";
import { EditUserBio } from "./edit_user_bio";

interface PublicOverviewProps {
  publicUser: NonNullable<UserProfile>,
}

const NULL_BIO = `### Novice Typehero! ✨📜
#### Embark on your Typehero journey, intrepid developer! Your quest begins
right here, in the realm of code and creativity. This is your profile page,
a digital canvas where you can etch your biography into the annals of the web.

But beware, for this is a public stage, where your feats and knowledge shall
be displayed for all to see. Fear not, for you hold the power of the mighty
pencil icon, perched atop this page. Click it, and you shall unlock the
ability to inscribe your tale with the magic of Markdown, crafting wonders and
conjuring marvels with your keystrokes.

This is your adventure, Typehero. Set forth, wield your code with wisdom, and shape
the digital world with your creativity. The land of markdown and fancy things
is yours to conquer!
`;

export const ProfileOverview = ({ publicUser }: PublicOverviewProps) => {
  return (
    <div className='flex flex-col gap-4'>
      {
        publicUser.bio && publicUser.bio?.length > 1 ? (
          <Card>
            <CardContent className='relative p-6 flex flex-col gap-4'>
              <div className="absolute right-5 z-[50]">
                <EditUserBio publicUser={publicUser} updateData={updateUserBio} />
              </div>
              <Markdown className='relative last-of-type:mb-0'>
                {publicUser.bio}
              </Markdown>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className='p-6 relative'>
              <div className="absolute right-5 z-[50]">
                <EditUserBio publicUser={publicUser} updateData={updateUserBio} />
              </div>
              <Markdown className='relative last-of-type:mb-0 break-all'>
                {NULL_BIO}
              </Markdown>
            </CardContent>
          </Card>
        )
      }
      <div className='flex flex-wrap gap-4'>
        <Card className='w-full md:w-[300px]'>
          <CardContent className='p-6'>
            <div className='flex flex-row gap-4 items-center'>
              <Heart />
              <div className='flex flex-col gap-2'>
                <span className='text-lg font-semibold'>Joined</span>
                <span className='text-sm'>{getRelativeTime(publicUser.createdAt)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
