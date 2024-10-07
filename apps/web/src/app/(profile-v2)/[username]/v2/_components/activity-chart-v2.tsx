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
import { MessageCircle, FileCode, Award } from '@repo/ui/icons';

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

export function ActivityChart2(props: { data: ReturnType<typeof generateSampleData> }) {
  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-[350px]">
      <ScatterChart data={props.data} accessibilityLayer>
        <ChartTooltip
          cursor={false}
          content={(props) => {
            const payload = (props.payload?.[0]?.payload as Record<string, number>) ?? {};
            const customPayload = Object.entries(payload ?? {})
              .filter(([key]) => key === 'comments' || key === 'badges' || key === 'submissions')
              .map(([key, val]) => ({ name: key, value: val, payload }));
            return <ChartTooltipContent {...props} payload={customPayload} />;
          }}
          labelFormatter={(_, [val]) => {
            return format(val?.payload.date, 'dd MMM');
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
          shape={(item) => {
            const squareLength = 24;
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
                  className="fill-zinc-900"
                />
                <rect
                  x={item.cx - squareLength / 2}
                  y={item.cy - squareLength / 2}
                  width={squareLength}
                  height={squareLength}
                  className={getColor(item.activity)}
                  rx={2}
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
