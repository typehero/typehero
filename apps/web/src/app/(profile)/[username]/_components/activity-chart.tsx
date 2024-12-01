'use client';
import {
  ChartContainer,
  type ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
} from '@repo/ui/components/chart';
import { Scatter, ScatterChart, XAxis, YAxis, ZAxis } from '@repo/ui/recharts';
import { format, setWeek, startOfYear } from 'date-fns';
import { MessageCircle, FileCode, Award } from '@repo/ui/icons';
import { cn } from '@repo/ui/cn';
import { atom, useAtom, type PrimitiveAtom } from 'jotai';
import { useMemo } from 'react';
import { useIsMobile } from '~/utils/useIsMobile';

const chartConfig = {
  submissions: {
    label: 'Submissions',
    icon: FileCode,
  },
  comments: {
    label: 'Comments',
    icon: MessageCircle,
  },
  badges: {
    label: 'Badges',
    icon: Award,
  },
} satisfies ChartConfig;

export function ActivityChart(props: {
  data: {
    date: Date;
    day: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    week: number;
    month: number;
    comments: number;
    badges: number;
    submissions: number;
    activity: number;
  }[];
}) {
  return (
    <ChartContainer config={chartConfig} className="pointer-events-auto aspect-[8/7] h-[270px]">
      <ScatterChart data={props.data} accessibilityLayer>
        <ChartTooltip
          cursor={false}
          content={({ payload, content: _, ...props }) => {
            const innerPayload = (payload?.[0]?.payload as Record<string, number>) ?? {};
            const customPayload = Object.entries(innerPayload ?? {})
              .filter(([key]) => key === 'comments' || key === 'badges' || key === 'submissions')
              .map(([key, val]) => ({ name: key, value: val, payload }));
            return <ChartTooltipContent {...props} payload={customPayload} />;
          }}
          labelFormatter={(_, [val]) => {
            return format(val?.payload[0].payload.date, 'dd MMM');
          }}
        />
        <XAxis
          orientation="bottom"
          dataKey="week"
          type="category"
          allowDuplicatedCategory={false}
          tickLine={false}
          axisLine={false}
          tickFormatter={(val, idx) => {
            return getMonthFromWeek(val, idx);
          }}
        />

        <YAxis dataKey="day" type="category" allowDuplicatedCategory={false} hide />
        <ZAxis dataKey="activity" type="number" />
        <Scatter
          // ReCharts has this type defined as Record<string, any> so attempting
          // to overide it throws an error
          shape={(props: unknown) => (
            <ActivitySquare {...(props as { cx: number; cy: number; activity: number })} />
          )}
        />
      </ScatterChart>
    </ChartContainer>
  );
}

function ActivitySquare(props: { cx: number; cy: number; activity: number }) {
  const { cx, cy, activity } = props;
  const squareLength = 24;
  const borderV = 10;
  const borderH = 12;
  return (
    <SquareWrapper>
      {(isSelected) => (
        <>
          <rect
            x={cx - squareLength / 2}
            y={cy - squareLength / 2}
            width={squareLength}
            height={squareLength}
            className={cn(getColor(activity), isSelected ? 'stroke-primary stroke-2' : '')}
            rx={2}
          />
          <rect
            x={cx - borderH / 2 - squareLength / 2}
            y={cy - borderV / 2 - squareLength / 2}
            width={squareLength + borderH}
            height={squareLength + borderV}
            className="fill-transparent"
          />
        </>
      )}
    </SquareWrapper>
  );
}

const activeNodeAtom = atom<PrimitiveAtom<boolean> | null>(null);
const SquareWrapper = (props: { children: (isSelected: boolean) => React.ReactElement }) => {
  const baseSelectedAtom = useMemo(() => atom(false), []);
  const selectedAtom = useMemo(
    () =>
      atom(
        (get) => get(baseSelectedAtom),
        (get, set) => {
          const currentActiveAtom = get(activeNodeAtom);
          if (currentActiveAtom !== null) {
            set(currentActiveAtom, false);
          }
          set(baseSelectedAtom, true);
          set(activeNodeAtom, baseSelectedAtom);
        },
      ),
    [baseSelectedAtom],
  );
  const [isSelected, toggleSelect] = useAtom(selectedAtom);
  const isMobile = useIsMobile();
  function handleClick() {
    if (isMobile) {
      toggleSelect();
    }
  }
  return <g onClick={handleClick}>{props.children(isSelected)}</g>;
};

function getColor(count: number) {
  if (count < 1) {
    return 'fill-sky-600/10';
  } else if (count < 3) {
    return 'fill-sky-600/30';
  } else if (count < 5) {
    return 'fill-sky-600/60';
  } else if (count < 7) {
    return 'fill-sky-600/100';
  }
  return 'fill-sky-600/100';
}
function getMonthFromWeek(weekNumber: number, idx: number) {
  const year = new Date().getFullYear();
  // Create a date object for the first day of the given year
  const firstDayOfYear = startOfYear(new Date(year, 0, 1));

  // Set the week number
  const targetDate = setWeek(firstDayOfYear, weekNumber, { weekStartsOn: 1 });
  if (idx % 4 === 0) {
    return format(targetDate, 'MMM');
  }
  return '';
}
