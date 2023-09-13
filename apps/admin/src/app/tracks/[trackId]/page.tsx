import { prisma } from '@repo/db';
import { UpdateTrackForm } from './_components/update-track-form';
import { cache } from 'react';

export interface Props {
  params: {
    trackId: string;
  };
}

export default async function (props: Props) {
  const track = await getTrackById(Number(props.params.trackId));
  const challenges = await getChallenges();

  return <UpdateTrackForm track={track} challenges={challenges} />;
}

export type TrackToManage = NonNullable<Awaited<ReturnType<typeof getTrackById>>>;
const getTrackById = cache((id: number) => {
  return prisma.track.findFirstOrThrow({
    where: {
      id,
    },
    include: {
      trackChallenges: true,
    },
  });
});

export type ChallengesForTrack = NonNullable<Awaited<ReturnType<typeof getChallenges>>>;
function getChallenges() {
  return prisma.challenge.findMany({
    where: {
      status: 'ACTIVE',
    },
  });
}
