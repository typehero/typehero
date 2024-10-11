'use client';

import {
  Label,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from '@repo/ui/recharts';

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@repo/ui/components/chart';
import Link from 'next/link';
import { ArrowUpRight } from '@repo/ui/icons';

export const description = 'A radial chart with a grid';

const chartData = [
  {
    difficulty: 'beginner',
    completedPercentage: 25,
    completed: 20,
    fill: 'var(--color-beginner)',
  },
  {
    difficulty: 'easy',
    completedPercentage: 66.67,
    completed: 20,
    fill: 'var(--color-easy)',
  },
  {
    difficulty: 'medium',
    completedPercentage: 100,
    completed: 20,
    fill: 'var(--color-medium)',
  },
  {
    difficulty: 'hard',
    completedPercentage: 75,
    completed: 20,
    fill: 'var(--color-hard)',
  },
  {
    difficulty: 'expert',
    completedPercentage: 100,
    completed: 20,
    fill: 'var(--color-expert)',
  },
];

const chartConfig = {
  beginner: {
    label: 'Beginner',
    color: 'hsl(var(--chart-1))',
  },
  easy: {
    label: 'Easy',
    color: 'hsl(var(--chart-2))',
  },
  medium: {
    label: 'Medium',
    color: 'hsl(var(--chart-3))',
  },
  hard: {
    label: 'Hard',
    color: 'hsl(var(--chart-4))',
  },
  expert: {
    label: 'Expert',
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig;

export function ProgressChart() {
  const totalCompleted = 80;
  return (
    <div className="flex flex-row items-start space-x-4">
      <div className="grid h-fit grid-flow-col grid-rows-3 gap-6">
        {chartData.map((d) => (
          <LegendItem
            key={d.difficulty}
            completed={d.completed}
            difficulty={d.difficulty}
            config={chartConfig}
          />
        ))}
      </div>
      <ChartContainer config={chartConfig} className="aspect-square h-[280px] ">
        <RadialBarChart
          data={chartData}
          innerRadius={50}
          outerRadius={140}
          startAngle={90}
          endAngle={-270}
          barCategoryGap={3}
        >
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel nameKey="difficulty" tooltipUnit="%" />}
          />
          <PolarAngleAxis domain={[0, 100]} type="number" tickLine={false} tick={false} />
          <PolarRadiusAxis type="category" tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                  return (
                    <Link href="./v2/completed" className="group">
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          dy={-15}
                          y={viewBox.cy}
                          className="fill-muted-foreground group-hover:underline"
                        >
                          Total
                        </tspan>
                        <ArrowUpRight className="ml-1 h-4 w-4 " />
                        <tspan
                          y={viewBox.cy}
                          x={viewBox.cx}
                          dy={15}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {totalCompleted}
                        </tspan>
                      </text>
                      <foreignObject
                        x={(viewBox.cx ?? 0) + 15}
                        y={(viewBox.cy ?? 0) - 25}
                        width="20"
                        height="20"
                      >
                        <ArrowUpRight className="text-muted-foreground h-4 w-4" />
                      </foreignObject>
                    </Link>
                  );
                }
              }}
            />
          </PolarRadiusAxis>
          <RadialBar dataKey="completedPercentage" cornerRadius={10} />
        </RadialBarChart>
      </ChartContainer>
    </div>
  );
}

function LegendItem(props: { difficulty: string; completed: number; config: ChartConfig }) {
  return (
    <div>
      <div className="flex flex-row space-x-2">
        <div
          className="mt-1.5 h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: props.config[props.difficulty]?.color }}
        />
        <div>
          <h1 className="text-muted-foreground">{props.config[props.difficulty]?.label}</h1>
          <h2 className="text-3xl">{props.completed}</h2>
        </div>
      </div>
    </div>
  );
}
