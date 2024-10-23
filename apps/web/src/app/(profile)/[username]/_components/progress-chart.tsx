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

const chartConfig = {
  BEGINNER: {
    label: 'Beginner',
    color: 'hsl(var(--chart-1))',
  },
  EASY: {
    label: 'Easy',
    color: 'hsl(var(--chart-2))',
  },
  MEDIUM: {
    label: 'Medium',
    color: 'hsl(var(--chart-3))',
  },
  HARD: {
    label: 'Hard',
    color: 'hsl(var(--chart-4))',
  },
  EXTREME: {
    label: 'Extreme',
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig;

export function ProgressChart(props: {
  chartData: {
    difficulty: string;
    completed: number;
    completedPercentage: number;
    total: number;
  }[];
  totalCompleted: number;
  totalChallenges: number;
  allCompletedHref: string;
}) {
  return (
    <div className="flex flex-row flex-wrap-reverse items-center justify-center gap-3 lg:items-start">
      <div className="grid h-fit grid-cols-3 gap-6 lg:grid-cols-2 lg:grid-rows-3">
        {props.chartData.map((d) => (
          <LegendItem
            key={d.difficulty}
            completed={d.completed}
            difficulty={d.difficulty}
            total={d.total}
            config={chartConfig}
          />
        ))}
      </div>
      <ChartContainer
        config={chartConfig}
        className="[&_.recharts-radial-bar-background-sector]:fill-muted-foreground/20 dark:[&_.recharts-radial-bar-background-sector]:fill-muted/40 aspect-square h-[280px]"
      >
        <RadialBarChart
          data={props.chartData}
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
                    <Link href={props.allCompletedHref} className="group">
                      <text
                        x={(viewBox.cx ?? 0) - 5}
                        y={(viewBox.cy ?? 0) - 30}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-muted-foreground group-hover:underline"
                      >
                        Total
                      </text>

                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-foreground text-4xl font-bold"
                      >
                        {props.totalCompleted}
                      </text>

                      <text
                        x={viewBox.cx}
                        y={(viewBox.cy ?? 0) + 30}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-muted-foreground text-sm"
                      >
                        of {props.totalChallenges}
                      </text>
                      <foreignObject
                        x={(viewBox.cx ?? 0) + 10}
                        y={(viewBox.cy ?? 0) - 39}
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
          <RadialBar
            dataKey="completedPercentage"
            cornerRadius={10}
            minPointSize={-1}
            background={{
              className: undefined,
              fill: '#fff',
            }}
          />
        </RadialBarChart>
      </ChartContainer>
    </div>
  );
}

function LegendItem(props: {
  difficulty: string;
  completed: number;
  total: number;
  config: ChartConfig;
}) {
  return (
    <div>
      <div className="flex flex-row space-x-2">
        <div
          className="mt-1.5 h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: props.config[props.difficulty]?.color }}
        />
        <div>
          <h1 className="text-muted-foreground">{props.config[props.difficulty]?.label}</h1>
          <div className="flex flex-row items-baseline space-x-1">
            <h2 className="text-3xl">{props.completed}</h2>
            <h3 className="text-muted-foreground text-sm">/ {props.total}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
