'use client';
import {
  ChartContainer,
  type ChartConfig,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from '@repo/ui/components/chart';
import { Scatter, ScatterChart, CartesianGrid, XAxis, YAxis, ZAxis } from '@repo/ui/recharts';
import type { generateSampleData } from '../page';
import { format, getMonth, setWeek, startOfYear, subDays } from 'date-fns';
import { get } from 'lodash';

const chartConfig = {
  count: {
    label: 'Contributions',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function ActivityChart2(props: { data: ReturnType<typeof generateSampleData> }) {
  return (
    <ChartContainer config={chartConfig} className="h-[200px] w-[250px]">
      <ScatterChart data={props.data} accessibilityLayer>
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(_, payload) => {
                return format(payload[1]?.payload.date, 'dd MMM');
              }}
            />
          }
        />
        <XAxis
          dataKey="week"
          type="category"
          allowDuplicatedCategory={false}
          tickLine={false}
          axisLine={false}
          tickFormatter={(val, idx) => {
            return getMonthFromWeek(val, idx);
            return '';
          }}
        />

        <YAxis dataKey="day" type="category" allowDuplicatedCategory={false} hide />
        <ZAxis dataKey="count" type="number" />
        <Scatter
          dataKey="count"
          shape={(item) => {
            const squareLength = 16;
            const borderV = 10;
            const borderH = 17;
            // console.log(item);
            return (
              <g>
                <rect
                  x={item.cx - borderH / 2 - squareLength / 2}
                  y={item.cy - borderV / 2 - squareLength / 2}
                  width={squareLength + borderH}
                  height={squareLength + borderV}
                  // className="fill-zinc-500"
                  className="fill-background"
                />
                <rect
                  x={item.cx - squareLength / 2}
                  y={item.cy - squareLength / 2}
                  width={squareLength}
                  height={squareLength}
                  className={getColor(item.count)}
                />
              </g>
            );
          }}
        />
      </ScatterChart>
    </ChartContainer>
  );
}

function getColor(count: number) {
  if (count < 1) {
    return 'fill-cyan-200';
  } else if (count < 3) {
    return 'fill-sky-300';
  }
  return 'fill-sky-500';
}
const monthMap: Record<number, string> = {};
function getMonthFromWeek(weekNumber: number, idx: number) {
  const year = new Date().getFullYear();
  // Create a date object for the first day of the given year
  const firstDayOfYear = startOfYear(new Date(year, 0, 1));

  // Set the week number
  const targetDate = setWeek(firstDayOfYear, weekNumber, { weekStartsOn: 1 });
  if (weekNumber % 4 === 0) {
    return format(targetDate, 'MMM');
  } else {
    return '';
  }
}
