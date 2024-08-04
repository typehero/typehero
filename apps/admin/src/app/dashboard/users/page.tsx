import { auth } from '~/server/auth';
import { DataTable } from '@repo/ui/components/data-table';
import { assertAdmin } from '~/utils/auth-guards';
import { getBannedUsers } from './_actions';
import { columns } from './_components/columns';

export default async function BannedUsers() {
  const session = await auth();
  assertAdmin(session);

  const reports = await getBannedUsers();

  return (
    <div>
      <DataTable data={reports} columns={columns} />
    </div>
  );
}
