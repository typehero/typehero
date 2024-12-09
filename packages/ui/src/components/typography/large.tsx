interface TypographyLargeProps {
  children: React.ReactNode;
}
export function TypographyLarge({ children }: TypographyLargeProps) {
  return <div className="text-lg font-semibold">{children}</div>;
}
