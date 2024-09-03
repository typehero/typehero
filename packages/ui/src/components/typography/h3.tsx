import { cn } from '../../cn';

interface Props extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export function TypographyH3({ children, className, ...props }: Props) {
  return (
    <h3 className={cn('scroll-m-20 font-semibold text-2xl tracking-tight', className)} {...props}>
      {children}
    </h3>
  );
}
