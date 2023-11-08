import { DataTable } from '@repo/ui/components/data-table';
import { getBannedUsers } from './_actions';
import { columns } from './_components/columns';

export default async function BannedUsers() {
  const reports = await getBannedUsers();

  return (
    <div>
      <DataTable data={reports} columns={columns} />
    </div>
  );
}
