import { DailyCountdownTimerClientComponent } from './CountdownTimer';
import Image from 'next/image';

export const DailyCountdownTimer = () => {
  const nowDate = Date.now();
  const aotStarted = nowDate >= new Date(Date.UTC(2024, 11, 1, 5, 0, 0)).getTime();
  const isAtLeastOneDayPastAotEndDate =
    nowDate >= new Date(Date.UTC(2024, 11, 26, 5, 0, 0)).getTime();

  // This will render one day after the last challenge is released
  if (isAtLeastOneDayPastAotEndDate) {
    return (
      <>
        <p className="text-center text-xl font-semibold">Thats a wrap! See you next year!</p>
        <p className="text-center text-xl font-semibold">
          <Image src="/santa_dead.png" width={200} height={200} alt="" className="" />
        </p>
      </>
    );
  }

  return aotStarted ? <DailyCountdownTimerClientComponent /> : <></>;
};
