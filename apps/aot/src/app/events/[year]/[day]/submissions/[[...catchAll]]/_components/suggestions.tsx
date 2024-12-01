'use client';

interface SuggestionsProps {
  track: string | null;
  challengeId: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Suggestions({ track, challengeId }: SuggestionsProps) {
  // // Get suggested challenges
  // const { data: similarChallenges } = useQuery({
  //   queryKey: ['similar-challenges', challengeId],
  //   queryFn: () => {
  //     return getSimilarChallenges(challengeId);
  //   },
  // });
  //
  // const currentIndex = useMemo(() => {
  //   if (trackDetails === null || trackDetails === undefined) return null;
  //
  //   const index = trackDetails.trackChallenges.findIndex((x) => x.challengeId === challengeId);
  //   return index === -1 ? null : index;
  // }, [trackDetails, challengeId]);
  //
  // // Get next challenge in Track
  // const next = useMemo(() => {
  //   if (currentIndex === null) return null;
  //
  //   const index = currentIndex + 1;
  //   return index < trackDetails!.trackChallenges.length
  //     ? trackDetails!.trackChallenges[index]
  //     : null;
  // }, [currentIndex, trackDetails]);
  //
  // return (
  //   <div className="w-full max-w-[1000px] md:py-4 md:pb-8">
  //     {trackDetails && next ? (
  //       <>
  //         <div className="flex items-center justify-between p-3">
  //           <h3 className="text-foreground/70 flex items-center gap-2 text-lg font-semibold md:text-xl">
  //             <Swords size={26} />
  //             {`Next Up in ${trackDetails?.name}`}
  //           </h3>
  //           <Link href={`/tracks/${track}`}>
  //             <Button size="sm" className="gap-1 rounded-full" variant="outline">
  //               More <ChevronRight size={13} />
  //             </Button>
  //           </Link>
  //         </div>
  //         <div className="px-3">
  //           <Link href={`/challenge/${next.challenge.slug}`}>
  //             <TrackChallenge
  //               challenge={next.challenge}
  //               isInProgress={false}
  //               hideSubmissionStatus
  //               isCompleted={false}
  //             />
  //           </Link>
  //         </div>
  //       </>
  //     ) : null}
  //
  //     {similarChallenges ? (
  //       <>
  //         <div className="flex items-center justify-between p-3">
  //           <h3 className="text-foreground/70 text-lg font-semibold md:text-xl">More Challenges</h3>
  //           <Link href="/explore">
  //             <Button size="sm" className="gap-1 rounded-full" variant="outline">
  //               Explore <ChevronRight size={13} />
  //             </Button>
  //           </Link>
  //         </div>
  //         <div className="px-3">
  //           {similarChallenges?.map((challenge, idx) => {
  //             return (
  //               <Link href={`/challenge/${challenge.slug}`} key={idx}>
  //                 <TrackChallenge
  //                   challenge={{ ...challenge, submission: [] }}
  //                   hideSubmissionStatus
  //                   isCompleted={false}
  //                   isInProgress={false}
  //                 />
  //               </Link>
  //             );
  //           })}
  //         </div>
  //       </>
  //     ) : null}
  //   </div>
  // );
  //
  //
  return <div>TODO: Suggestions</div>;
}
