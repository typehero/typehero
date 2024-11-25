import { LandingCountdownTimerClientComponent } from '../CountdownTimer';

export const LandingCountdownTimer = () => {
  const aotStarted = Date.now() >= new Date(Date.UTC(2024, 11, 1, 5, 0, 0)).getTime();
  // div prevents layout shift in [year]/page.tsx
  return aotStarted ? <div /> : <LandingCountdownTimerClientComponent />;
};
