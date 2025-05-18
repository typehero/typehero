import { DailyCountdownTimerClientComponent } from './CountdownTimer';

export const DailyCountdownTimer = () => {
  const nowDate = Date.now();
  const isAtLeastOneDayPastAotEndDate =
    nowDate >= new Date(Date.UTC(2024, 11, 26, 5, 0, 0)).getTime();

  // This will render one day after the last challenge is released
  if (isAtLeastOneDayPastAotEndDate) {
    return null;
  }

  return <DailyCountdownTimerClientComponent />;
};
