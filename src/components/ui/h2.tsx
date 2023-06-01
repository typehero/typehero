interface Props {
  children: React.ReactNode;
}
export function TypographyH2({ children }: Props) {
  return (
    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
      {children}
    </h2>
  );
}
