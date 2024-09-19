import { cn } from '@repo/ui/cn';
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@repo/ui/components/tooltip';
import { format, eachDayOfInterval, startOfWeek, subDays } from 'date-fns';

export function generateSampleData() {
  const endDate = new Date();
  // endDate.setDate(4);
  const startDate = startOfWeek(subDays(endDate, 60), { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: startDate, end: endDate }).map((date) => ({
    date,
    activity: Math.floor(Math.random() * 5),
  }));
  console.log({ startDate, endDate, count: days.length });
  return days;
}
function getColor(count: number) {
  if (count < 1) {
    return 'bg-cyan-200';
  } else if (count < 3) {
    return 'bg-sky-300';
  }
  return 'bg-sky-500';
}
function DayBox(props: { date: Date; activity: number }) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <div className={cn('h-5 w-5 rounded-[1px] ', getColor(props.activity))}> </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{format(props.date, 'eee MMMM dd yyyy')}</p>
      </TooltipContent>
    </Tooltip>
  );
}
interface DayInfo {
  date: Date;
  activity: number;
}

/* Gets a list of days and groups it by the week.
 * The list of days needs to start at the start of the week, monday in this case.
 * Keeps track if the start of the weekday is in a new month, so that it can be used to
 * show the month labels.
 */

function groupDaysByWeek(days: DayInfo[]) {
  const weeks: { days: DayInfo[]; isNewMonth: boolean }[] = [];

  let week: DayInfo[] = [];
  let month = '';
  for (const day of days) {
    week.push(day);
    if (week.length === 7 && week[0]) {
      const isNewMonth = month !== format(week[0].date, 'MMM');
      weeks.push({ days: week, isNewMonth });
      month = format(week[0].date, 'MMM');
      week = [];
    }
  }
  if (week.length > 0 && week[0]) {
    const isNewMonth = month !== format(week[0].date, 'MMM');
    weeks.push({ days: week, isNewMonth });
    month = format(week[0].date, 'MMM');
  }

  //Prevents the first two months from stacking next to each other.
  if (weeks[1] && weeks[1].isNewMonth && weeks[0]) {
    weeks[0].isNewMonth = false;
  }
  return weeks;
}

export function ActivityChart(props: { days: { date: Date; activity: number }[] }) {
  const weeks = groupDaysByWeek(props.days);
  return (
    <div className="relative flex flex-row gap-1.5 pt-4">
      <TooltipProvider>
        {weeks.map((week) => {
          return (
            <div key={week.days.toString()} className="flex flex-col gap-1.5">
              {week.isNewMonth && week.days[0] ? (
                <span className="text-muted-foreground absolute -top-1 text-sm tracking-tight">
                  {format(week.days[0].date, 'MMM')}
                </span>
              ) : null}
              {week.days.map((day) => (
                <DayBox key={day.date.toString()} date={day.date} activity={day.activity} />
              ))}
            </div>
          );
        })}
      </TooltipProvider>
    </div>
  );
}
