import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/avatar";
import { updateUserLinks, type UserPrivateProfile, type UserProfile } from "./profile.actions";
import { MagicIcon } from "@repo/ui/components/magic-icon";
import Link from "next/link";
import { calculateInitials, stripProtocolAndWWW } from "~/utils/stringUtils";
import { EditUserLinks } from "./edit_user_links";

interface UserProfilePaneProps {
  publicUser: NonNullable<UserProfile>;
  privateUser: UserPrivateProfile;
}

export const ProfilePane = ({ publicUser, privateUser }: UserProfilePaneProps) => {
  return (
    <div className='flex flex-col md:w-1/4 items-center justify-center space-y-6 md:h-full'>
      <div className='flex flex-col items-center gap-2'>
        <Avatar className='flex w-[15vw] h-[15vw]'>
          <AvatarImage src={publicUser.image ?? undefined} className='rounded-sm' />
          <AvatarFallback className='text-muted-foreground font-semibold'>{calculateInitials(publicUser.name)}</AvatarFallback>
        </Avatar>
        <span className='text-center text-xl'>@{publicUser.name}</span>
      </div>
      <div className='flex flex-row group flex-wrap md:flex-col gap-4'>
        <div className="flex flex-row flex-wrap md:flex-col gap-2 peer">
        {
          publicUser.userLinks.length > 0 ? (
            publicUser.userLinks.map((u) => u.url).map((url) => {
              if (url.length === 0) return;
              return <div className='flex flex-row items-center'>
                <MagicIcon url={url} className='mr-2' />
                <Link href={url} target='_blank'>
                  <span className='text-sm hover:underline cursor-pointer'>{stripProtocolAndWWW(url)}</span>
                </Link>
              </div>
            })
          )
            : null
        }
        </div>
        {
          privateUser != null ? (
            <EditUserLinks publicUser={publicUser} updateData={updateUserLinks} />
          ) : null
        }
      </div>
    </div>
  );
}
