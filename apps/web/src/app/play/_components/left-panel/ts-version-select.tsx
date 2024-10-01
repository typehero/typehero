import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/select';
import { supportedVersions } from './ts-supported-versions';
import { ScrollArea } from '@repo/ui/components/scroll-area';

interface Props {
  version?: string;
  onVersionChange?: (value: string) => void;
}
export function TsVersionSelect({ version, onVersionChange }: Props) {
  return (
    <Select value={version} defaultValue={supportedVersions.at(-1)} onValueChange={onVersionChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="TS Version" />
      </SelectTrigger>
      <SelectContent>
        <ScrollArea className="h-72 w-48 rounded-md border">
          {supportedVersions.map((version) => (
            <SelectItem key={version} value={version}>
              {version}
            </SelectItem>
          ))}
        </ScrollArea>
      </SelectContent>
    </Select>
  );
}
