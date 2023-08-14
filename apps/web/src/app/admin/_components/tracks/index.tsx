import { ActionBar } from './action-bar';
import { columns } from './columns';
import { DataTable } from './data-table';

export async function ManageTracks() {
  return (
    <div>
      <ActionBar />
      <DataTable columns={columns} />
    </div>
  );
}
