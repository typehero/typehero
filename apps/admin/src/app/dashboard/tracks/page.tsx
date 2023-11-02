import { DataTable } from '@repo/ui/components/data-table';
import { getTracks } from './tracks.actions';
import { ActionBar } from './_components/action-bar';
import { columns } from './_components/columns';

export default async function () {
  const data = await getTracks();
  return (
    <div>
      <ActionBar />
      <DataTable data={data} columns={columns} />
    </div>
  );
}
