import { Loader as LoaderIcon } from 'lucide-react';

export default function ReportIdLoading() {
  return (
    <div className="container text-center">
      <LoaderIcon className="animate-spin duration-1000 ease-in-out spin-in" />
    </div>
  );
}
