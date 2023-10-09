import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar';
import { MagicIcon } from '@repo/ui/components/magic-icon';
import Link from 'next/link';
import { calculateInitials, stripProtocolAndWWW } from '~/utils/stringUtils';
import { EditUserLinks } from './edit_user_links';
import { updateUserLinks, type UserPrivateProfile, type UserProfile } from './profile.actions';

interface UserProfilePaneProps {
  publicUser: NonNullable<UserProfile>;
  privateUser: UserPrivateProfile;
}

export const ProfilePane = ({ publicUser, privateUser }: UserProfilePaneProps) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 md:h-full md:w-1/4">
      <div className="flex flex-col items-center gap-2">
        <Avatar className="flex h-[15vw] w-[15vw]">
          <AvatarImage src={publicUser.image ?? undefined} className="rounded-sm" />
          <AvatarFallback className="text-muted-foreground font-semibold">
            {calculateInitials(publicUser.name)}
          </AvatarFallback>
        </Avatar>
        <span className="text-center text-xl">@{publicUser.name}</span>
      </div>
      <div className="group flex flex-row flex-wrap gap-4 md:flex-col">
        <div className="peer flex flex-row flex-wrap gap-2 md:flex-col">
          {publicUser.userLinks.length > 0
            ? publicUser.userLinks
                .map((u) => u.url)
                .map((url, idx) => {
                  if (url.length === 0) return;
                  return (
                    <div key={`url-${idx}`} className="flex flex-row items-center">
                      <MagicIcon url={url} className="mr-2" />
                      <Link href={url} target="_blank">
                        <span className="cursor-pointer text-sm hover:underline">
                          {stripProtocolAndWWW(url)}
                        </span>
                      </Link>
                    </div>
                  );
                })
            : null}
        </div>
        {privateUser != null ? (
          <EditUserLinks publicUser={publicUser} updateData={updateUserLinks} />
        ) : null}
      </div>
    </div>
  );
};
