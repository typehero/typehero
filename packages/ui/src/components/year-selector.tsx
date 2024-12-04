'use client';
import * as Select from '@radix-ui/react-select';
import { ChevronDownIcon } from 'lucide-react';
import * as React from 'react';
import { cn } from '../cn';

const YEARS = ['2024', '2023'];

const YEAR_TO_SELECT_ITEMS_MAP: Record<string, (isLive: boolean) => React.JSX.Element | number> = {
  '2024': (isLive: boolean) => {
    return (
      <div className="inline-flex flex-row items-center gap-2">
        {isLive ? (
          <>
            <div className="h-2 w-2 animate-ping rounded-full bg-red-500" />
            <div className="-ml-4 h-2 w-2 rounded-full bg-red-500" />
          </>
        ) : null}
        2024
      </div>
    );
  },
  '2023': () => 2023,
};

export const YearSelector = (props: {
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  showLive: boolean;
}) => {
  return (
    <Select.Root value={props.selectedYear} onValueChange={props.setSelectedYear}>
      <Select.Trigger
        className="flex items-center justify-end gap-1 rounded-full px-1.5 text-black/60 duration-300 hover:bg-black/10 hover:text-black dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white"
        title="Select year"
      >
        <Select.Value>
          {YEAR_TO_SELECT_ITEMS_MAP[props.selectedYear]?.(props.showLive)}
        </Select.Value>
        <Select.Icon>
          <ChevronDownIcon className="h-4 w-4 stroke-2" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position="popper"
          align="center"
          alignOffset={10}
          className="data-[state=open]:animate-in date-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-50 gap-1 data-[side=bottom]:translate-y-1"
        >
          {YEARS.filter((y) => y !== props.selectedYear).map((y) => (
            <SelectItem key={y} value={y}>
              {YEAR_TO_SELECT_ITEMS_MAP[y]?.(props.showLive)}
            </SelectItem>
          ))}
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

const SelectItem = React.forwardRef<
  React.ElementRef<typeof Select.Item>,
  React.ComponentPropsWithoutRef<typeof Select.Item>
>(({ children, className, ...props }, forwardedRef) => {
  return (
    <Select.Item
      className={cn(
        'cursor-pointer select-none rounded-xl border border-black/40 bg-black/20 px-3 outline-none backdrop-blur dark:border-white/40 dark:bg-white/20',
        'inline-flex items-center justify-end gap-1 rounded-full',
        className,
      )}
      {...props}
      ref={forwardedRef}
    >
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center"></Select.ItemIndicator>
    </Select.Item>
  );
});
