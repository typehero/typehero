import { cn } from '../cn';
import { Avatar, AvatarFallback, AvatarImage, DefaultAvatar } from './avatar';

interface UserAvatarProps {
  src: string;
  className?: string;
}
export function UserAvatar(props: UserAvatarProps) {
  return (
    <Avatar className={cn('h-7 w-7', props.className)}>
      <AvatarImage src={props.src} alt="user avatar" />
      <AvatarFallback delayMs={5000}>
        <DefaultAvatar />
      </AvatarFallback>
    </Avatar>
  );
}
