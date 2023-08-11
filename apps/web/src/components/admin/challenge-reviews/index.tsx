import { columns } from './columns';
import { DataTable } from './data-table';

export async function ChallengeReviews() {
  return (
    <div className="">
      <DataTable columns={columns} />
    </div>
  );
}
