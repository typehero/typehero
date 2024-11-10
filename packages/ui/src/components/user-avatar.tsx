import { cn } from '../cn';
import { Avatar, AvatarFallback, AvatarImage, DefaultAvatar } from './avatar';

interface Props {
  src: string;
  className?: string;
}
export function UserAvatar(props: Props) {
  return (
    <Avatar className={cn('h-7 w-7', props.className)}>
      <AvatarImage src={props.src} alt="user avatar" />
      <AvatarFallback delayMs={5000}>
        <DefaultAvatar />
      </AvatarFallback>
    </Avatar>
  );
}
