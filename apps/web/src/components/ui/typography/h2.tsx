import { cn } from '~/utils/cn';

interface Props extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export function TypographyH2({ children, className, ...props }: Props) {
  return (
    <h2
      className={cn(
        'scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0',
        className,
      )}
      {...props}
    >
      {children}
    </h2>
  );
}
