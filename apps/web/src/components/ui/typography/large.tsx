interface Props {
  children: React.ReactNode;
}
export function TypographyLarge({ children }: Props) {
  return <div className="text-lg font-semibold">{children}</div>;
}
