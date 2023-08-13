import { Loader as LoaderIcon } from '@repo/ui/icons';

export default function ReportIdLoading() {
  return (
    <div className="container text-center">
      <LoaderIcon className="spin-in animate-spin duration-1000 ease-in-out" />
    </div>
  );
}
