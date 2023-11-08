import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/select';
import { sortKeys } from '~/utils/sorting';

interface Props {
  sortKey: (typeof sortKeys)[number];
  setSortKey: (value: (typeof sortKeys)[number]) => void;
  setPage: (value: number) => void;
}

export function SortSelect({ sortKey, setSortKey, setPage }: Props) {
  return (
    <div className="flex items-center gap-2 px-3 py-2">
      <Select
        value={sortKey.value}
        defaultValue="newest"
        onValueChange={(value) => {
          setSortKey(sortKeys.find((sk) => sk.value === value) ?? sortKeys[0]);
          setPage(1);
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort Key" />
        </SelectTrigger>
        <SelectContent>
          {sortKeys.map((sortKey, index) => (
            <SelectItem key={index} value={sortKey.value}>
              {sortKey.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
