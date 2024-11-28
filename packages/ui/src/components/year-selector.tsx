'use client';
import * as Select from '@radix-ui/react-select';
import { ChevronDownIcon } from 'lucide-react';
import * as React from 'react';
import { cn } from '../cn';

const YEAR_COLOR_MAP: Record<string, string> = {
  '2024': 'border-red-800 from-red-950 to-red-700',
  '2023': 'border-emerald-800 from-emerald-700 to-emerald-900',
};

export function YearSelector(props: {
  selectedYear: string;
  setSelectedYear: (year: string) => void;
}) {
  return (
    <Select.Root
      defaultValue="2024"
      value={props.selectedYear}
      onValueChange={props.setSelectedYear}
    >
      {/* <Select.Trigger className="border-input ring-offset-background focus:ring-ring inline-flex items-center justify-center gap-1 px-2 text-black/50 hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-0 aria-expanded:text-black dark:text-white/80 dark:hover:text-yellow-400 dark:aria-expanded:text-yellow-400"> */}
      <Select.Trigger
        className={cn(
          'inline-flex items-center justify-center gap-1 rounded-full border bg-gradient-to-r px-3 py-1.5',
          YEAR_COLOR_MAP[props.selectedYear],
        )}
      >
        <Select.Value />
        <Select.Icon>
          <ChevronDownIcon className="h-5 w-6" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position="popper"
          className="data-[state=open]:animate-in date-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-50 gap-1 data-[side=bottom]:translate-y-1"
        >
          <SelectItem value="2024">
            <div className="inline-flex flex-row items-center gap-2">
              <div className="h-2 w-2 animate-ping rounded-full bg-red-500" />
              2024
            </div>
          </SelectItem>
          <SelectItem value="2023">2023</SelectItem>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

const SelectItem = React.forwardRef<
  React.ElementRef<typeof Select.Item>,
  React.ComponentPropsWithoutRef<typeof Select.Item>
>(({ children, className, ...props }, forwardedRef) => {
  return (
    <Select.Item
      className={cn(
        'cursor-pointer select-none outline-none',
        'inline-flex justify-center gap-2 rounded-full border bg-gradient-to-r px-3 py-1.5',
        YEAR_COLOR_MAP[props.value],
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
