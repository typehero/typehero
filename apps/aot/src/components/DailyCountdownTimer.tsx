import { DailyCountdownTimerClientComponent } from './CountdownTimer';

export const DailyCountdownTimer = () => {
  const aotStarted = Date.now() >= new Date(Date.UTC(2024, 11, 1, 5, 0, 0)).getTime();
  return aotStarted ? <DailyCountdownTimerClientComponent /> : <></>;
};
