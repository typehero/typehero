import { api } from '~/trpc/server';

export default async function Page() {
  const events = await api.event.getAll();
  return (
    <div>
      {events.map((event) => {
        const name = event.slug.split('-').at(-1);
        return <div key={event.id}>{name}</div>;
      })}
    </div>
  );
}
