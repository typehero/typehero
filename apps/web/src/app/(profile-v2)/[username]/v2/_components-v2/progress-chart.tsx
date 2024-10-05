'use client';

import {
  Label,
  PolarAngleAxis,
  PolarGrid,
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

export const description = 'A radial chart with a grid';

const chartData = [
  {
    difficulty: 'beginner',
    completedPercentage: 25,
    fill: 'var(--color-beginner)',
  },
  {
    difficulty: 'easy',
    completedPercentage: 66.67,
    fill: 'var(--color-easy)',
  },
  {
    difficulty: 'medium',
    completedPercentage: 100,
    fill: 'var(--color-medium)',
  },
  {
    difficulty: 'hard',
    completedPercentage: 75,
    fill: 'var(--color-hard)',
  },
  {
    difficulty: 'expert',
    completedPercentage: 30,
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
          content={<ChartTooltipContent hideLabel nameKey="difficulty" />}
        />
        <PolarAngleAxis domain={[0, 100]} type="number" tickLine={false} tick={false} />
        <PolarRadiusAxis type="category" tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                    <tspan x={viewBox.cx} dy={-15} y={viewBox.cy} className="fill-muted-foreground">
                      Total
                    </tspan>
                    <tspan
                      y={viewBox.cy}
                      x={viewBox.cx}
                      dy={15}
                      className="fill-foreground text-4xl font-bold"
                    >
                      {totalCompleted}
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
        <RadialBar dataKey="completedPercentage" cornerRadius={10} />
      </RadialBarChart>
    </ChartContainer>
  );
}
