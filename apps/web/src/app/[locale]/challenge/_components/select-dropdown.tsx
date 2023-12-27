import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/select';
import { SORT_KEYS } from './sheet-content-custom';

export interface SelectDropdownProps {
  sortKey: (typeof SORT_KEYS)[number];
  handleValueChange: (value: string) => void;
}

export const SelectDropdown = ({ sortKey, handleValueChange }: SelectDropdownProps) => (
  <Select value={sortKey.value} defaultValue="popular" onValueChange={handleValueChange}>
    <SelectTrigger className="w-[120px]">
      <SelectValue placeholder="Sort Key" />
    </SelectTrigger>
    <SelectContent>
      {SORT_KEYS.map((sortKey, index) => (
        <SelectItem key={index} value={sortKey.value}>
          {sortKey.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);
