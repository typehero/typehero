interface Props {
  children: React.ReactNode;
}
export function TypographyLarge({ children }: Props) {
  return <div className="font-semibold text-lg">{children}</div>;
}
