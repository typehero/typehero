import { cn } from '../../cn';

interface TypographyH1Props extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export function TypographyH1({ children, className, ...props }: TypographyH1Props) {
  return (
    <h1 className={cn('scroll-m-20 font-bold tracking-tight lg:text-5xl', className)} {...props}>
      {children}
    </h1>
  );
}
