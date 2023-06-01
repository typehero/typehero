import type { InferGetServerSidePropsType } from 'next';
import type { getServerSideProps } from '~/pages/[username]';
import { api } from '~/utils/api';

export function UserPage(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const userQuery = api.user.byName.useQuery({ name: props.username });
  const mutation = api.user.edit.useMutation();

  const { data: user } = userQuery;

  if (!user) return null;

  const handleClick = (id: string) => {
    mutation.mutate({
      id,
      data: {
        name: 'bautistaaa',
      },
    });
  };

  return (
    <>
      <h1>{user.id}</h1>
      <img src={user.image ?? ''} />

      <p>{user.email}</p>

      <h2 className="text-xl">Raw user:</h2>
      <pre>{JSON.stringify(user, null, 4)}</pre>
      <button onClick={() => handleClick(user.id)}>update user name for id: {user.id}</button>
    </>
  );
}
