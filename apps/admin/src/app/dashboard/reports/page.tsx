import { auth } from '@repo/auth/server';
import { DataTable } from '@repo/ui/components/data-table';
import { assertAdmin } from '~/utils/auth-guards';
import { getReports } from './_actions';
import { columns } from './_components/columns';

export default async function ReportsPage() {
  const session = await auth();
  assertAdmin(session);

  const reports = await getReports();

  return (
    <div>
      <DataTable data={reports} columns={columns} />
    </div>
  );
}
