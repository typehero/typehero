'use client';

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
} from '@repo/ui/recharts';

import { type ChartConfig, ChartContainer } from '@repo/ui/components/chart';

export const description = 'A radial chart with text';

const chartConfig = {
  completed: {
    label: 'Completed',
  },
} satisfies ChartConfig;

export function ProgressChart(props: {
  completed: number;
  max: number;
  difficulty: 'Beginner' | 'Easy' | 'Medium' | 'Hard' | 'Expert';
}) {
  const percentage = (props.completed / props.max) * 100;
  const data = [{ completed: percentage, fill: 'hsl(var(--chart-1))' }];
  return (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
      <RadialBarChart
        data={data}
        startAngle={90}
        endAngle={-270}
        innerRadius={80}
        outerRadius={110}
      >
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className="first:fill-muted last:fill-background"
          polarRadius={[86, 74]}
        />
        <RadialBar dataKey="completed" background cornerRadius={10} />
        <PolarAngleAxis domain={[0, 100]} type="number" tick={false} />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) - 28}
                      className="fill-muted-foreground"
                    >
                      {props.difficulty}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-4xl font-bold"
                    >
                      {data[0]?.completed}%
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      {props.completed} / {props.max}
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  );
}
