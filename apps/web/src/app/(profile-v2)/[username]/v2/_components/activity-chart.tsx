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
import { createContext, useContext, useEffect, useState } from 'react';
import { cn } from '@repo/ui/cn';
import { number } from 'zod';

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
  const [selectedNode, setSelectedNode] = useState<{ x: number; y: number } | null>(null);
  return (
    <SelectedNodeContext.Provider value={{ selectedNode, setSeletedNode: setSelectedNode }}>
      <ChartContainer config={chartConfig} className="pointer-events-auto aspect-[9/7] h-[250px]">
        <ScatterChart data={props.data} accessibilityLayer>
          <ChartTooltip
            cursor={false}
            content={({ payload, content, ...props }) => {
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
            shape={(item: unknown) => getShape(item)}
          />
        </ScatterChart>
      </ChartContainer>
    </SelectedNodeContext.Provider>
  );
}

const getShape = (item: unknown) => {
  const { cx, cy, activity, node } = item as {
    cx: number;
    cy: number;
    activity: number;
    node: { x: number; y: number };
  };
  const squareLength = 24;
  const borderV = 10;
  const borderH = 10;
  return (
    <SquareWrapper node={node}>
      <rect
        x={cx - borderH / 2 - squareLength / 2}
        y={cy - borderV / 2 - squareLength / 2}
        width={squareLength + borderH}
        height={squareLength + borderV}
        className="fill-transparent"
      />
      <Square
        node={node}
        x={cx - squareLength / 2}
        y={cy - squareLength / 2}
        width={squareLength}
        height={squareLength}
        className={getColor(activity)}
        rx={2}
      />
    </SquareWrapper>
  );
};
const Square = (props: {
  x: number;
  y: number;
  width: number;
  height: number;
  className: string;
  rx: number;
  node: { x: number; y: number };
}) => {
  // const context = useContext(SelectedNodeContext);
  const isSelected = false;
  console.log({ isSelected });
  return (
    <rect
      x={props.x}
      y={props.y}
      width={props.width}
      height={props.height}
      className={cn(
        props.className,
        isSelected ? 'stroke-red-500 stroke-1 transition-colors duration-1000' : '',
      )}
      rx={props.rx}
    />
  );
};
const SquareWrapper = (props: {
  children: React.ReactNode;
  node: {
    x: number;
    y: number;
  };
}) => {
  // const contexte = useContext(SelectedNodeContext);
  return <g>{props.children}</g>;
};

const SelectedNodeContext = createContext<{
  selectedNode: { x: number; y: number } | null;
  setSeletedNode: (node: { x: number; y: number }) => void;
} | null>(null);

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
