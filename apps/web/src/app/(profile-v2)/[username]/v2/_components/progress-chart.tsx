'use client';

import {
  Label,
  PolarRadiusAxis,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
} from '@repo/ui/recharts';

import { type ChartConfig, ChartContainer } from '@repo/ui/components/chart';
import { cn } from '@repo/ui/cn';

export const description = 'A radial chart with text';

const chartConfig = {
  completed: {
    label: 'Completed',
  },
} satisfies ChartConfig;

type Difficulty = 'Beginner' | 'Easy' | 'Expert' | 'Hard' | 'Medium';
//TODO: Change to css variables
const colorConfig: Record<Difficulty, [string, string]> = {
  Beginner: ['hsl( 198.6, 88.7%, 48.4% )', 'hsl( 188.7, 94.5%, 42.7% )'],
  Easy: ['hsl(142.1, 70.6%, 45.3%)', 'hsl(160.1, 84.1% ,39.4%)'],
  Medium: ['hsl(37.7, 92.1% ,50.2%)', 'hsl(47.9 ,95.8% ,53.1%)'],
  Hard: ['hsl(24.6, 95% ,53.1%)', 'hsl(0 ,72.2% ,50.6%)'],
  Expert: ['hsl(263.4, 70%, 50.4%)', 'hsl(270 ,95.2% ,75.3%)'],
};
//TODO: Remove
const DEBUG = false;
export function ProgressChart(props: { completed: number; max: number; difficulty: Difficulty }) {
  const percentage = (props.completed / props.max) * 100;
  const data = [{ completed: percentage }];
  return (
    <ChartContainer
      config={chartConfig}
      className={cn('mx-auto aspect-square w-full max-w-full ', DEBUG && 'border border-zinc-700')}
    >
      <RadialBarChart
        data={data}
        startAngle={90}
        endAngle={-270}
        innerRadius={'90%'}
        outerRadius={'90%'}
        barSize={20}
      >
        <defs>
          <linearGradient id={`${props.difficulty}-colorGradient`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colorConfig[props.difficulty][0]} stopOpacity={1} />
            <stop offset="100%" stopColor={colorConfig[props.difficulty][1]} stopOpacity={1} />
          </linearGradient>
        </defs>
        <RadialBar
          fill={`url(#${props.difficulty}-colorGradient)`}
          dataKey="completed"
          background
          cornerRadius={10}
        />
        <PolarAngleAxis domain={[0, 100]} type="number" tick={false} />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                console.log({ viewBox });
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                    <tspan x={viewBox.cx} y="30%" className="fill-muted-foreground">
                      {props.difficulty}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-xl font-bold lg:text-xl xl:text-4xl"
                    >
                      {data[0]?.completed}%
                    </tspan>
                    <tspan x={viewBox.cx} y="65%" className="fill-muted-foreground">
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
