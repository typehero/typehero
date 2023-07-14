import { getChallengeReports } from '~/components/admin/admin.actions';

export default async function ReportPage() {
  const reports = await getChallengeReports();
  return (
    <div>
      Reports table here. List all
      {reports.length}
    </div>
  );
}
