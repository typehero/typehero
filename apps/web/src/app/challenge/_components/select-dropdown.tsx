import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/select';
import { SORT_KEYS, type SortKeyType } from '~/app/get-challenges-and-title';

export interface SelectDropdownProps {
  sortKey: SortKeyType;
  handleValueChange: (value: string) => void;
}

export const SelectDropdown = ({ sortKey, handleValueChange }: SelectDropdownProps) => (
  <Select defaultValue={sortKey.value} onValueChange={handleValueChange}>
    <SelectTrigger className="w-[190px]">
      <SelectValue placeholder="Select Challenges" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Select Track</SelectLabel>
        {SORT_KEYS.map((sortKey, index) => (
          <SelectItem key={index} value={sortKey.value}>
            {sortKey.label} Challenges
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>
);
