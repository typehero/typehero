'use client';
interface TypographyPProps {
  children: React.ReactNode;
}
export function TypographyP({ children }: TypographyPProps) {
  return <p className="leading-7 [&:not(:first-child)]:mt-4">{children}</p>;
}
