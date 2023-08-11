import { Loader as LoaderIcon } from 'lucide-react';

export default function ReportIdLoading() {
  return (
    <div className="container text-center">
      <LoaderIcon className="spin-in animate-spin duration-1000 ease-in-out" />
    </div>
  );
}
