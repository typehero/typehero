import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/select';

interface SortKey {
  label: string;
  value: string;
  key: string;
  order: string;
}

interface SortSelectProps {
  currentSortKey: SortKey;
  totalSortKeys: readonly SortKey[];
  onValueChange: (value: string) => void;
}

export function SortSelect({ currentSortKey, totalSortKeys, onValueChange }: SortSelectProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-2">
      <Select value={currentSortKey.value} defaultValue="newest" onValueChange={onValueChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort Key" />
        </SelectTrigger>
        <SelectContent>
          {totalSortKeys.map((sortKey, index) => (
            <SelectItem key={index} value={sortKey.value}>
              {sortKey.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
