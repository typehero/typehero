'use client';
interface Props {
  children: React.ReactNode;
}
export function TypographyP({ children }: Props) {
  return <p className="leading-7 [&:not(:first-child)]:mt-4">{children}</p>;
}
