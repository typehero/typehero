export default function EventsByYearLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      Layout for DAY
      {children}
    </section>
  );
}
