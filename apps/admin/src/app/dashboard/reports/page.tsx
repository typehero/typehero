import { DataTable } from '@repo/ui/components/data-table';
import { getReports } from './_actions';
import { columns } from './_components/columns';

export default async function ReportsPage() {
  const reports = await getReports();

  return (
    <div>
      <DataTable data={reports} columns={columns} />
    </div>
  );
}
