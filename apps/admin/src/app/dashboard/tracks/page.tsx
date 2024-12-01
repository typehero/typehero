import { auth } from '~/server/auth';
import { DataTable } from '@repo/ui/components/data-table';
import { assertAdmin } from '~/utils/auth-guards';
import { ActionBar } from './_components/action-bar';
import { columns } from './_components/columns';
import { getTracks } from './tracks.actions';

export default async function TracksPage() {
  const session = await auth();
  assertAdmin(session);

  const data = await getTracks();
  return (
    <div>
      <ActionBar />
      <DataTable data={data} columns={columns} />
    </div>
  );
}
