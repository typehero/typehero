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

interface Props {
  currentSortKey: SortKey;
  totalSortKeys: readonly SortKey[];
  onValueChange: (value: string) => void;
}

export function SortSelect({ currentSortKey, totalSortKeys, onValueChange }: Props) {
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
