import { Bronze } from './BadgeSvg/bronze';
import { Platinum } from './BadgeSvg/platinum';
import { Gold } from './BadgeSvg/gold';
import { Silver } from './BadgeSvg/silver';

export function BronzeBadge({ className, shortName }: { className?: string; shortName: string }) {
  return <Bronze shortName={shortName} className={className} />;
}
export function SilverBadge({ className, shortName }: { className?: string; shortName: string }) {
  return <Silver shortName={shortName} className={className} />;
}
export function GoldBadge({ className, shortName }: { className?: string; shortName: string }) {
  return <Gold shortName={shortName} className={className} />;
}
export function PlatinumBadge({ className, shortName }: { className?: string; shortName: string }) {
  return <Platinum shortName={shortName} className={className} />;
}
