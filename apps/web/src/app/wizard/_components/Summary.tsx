interface Props {
  isUserACreator: boolean;
}
export function Summary({ isUserACreator }: Props) {
  return (
    <div className="flex flex-col items-center justify-center pt-12 pb-8">
      <div className="mb-3 max-w-[20ch] text-center font-bold text-3xl text-gray-900 md:text-5xl dark:text-gray-100">
        {isUserACreator ? (
          <>
            🎉 <br />
            <br /> Thanks for creating a challenge! Submit it to share with the community.
          </>
        ) : (
          <>
            🎉 <br /> <br />
            Thanks for creating a challenge! Submit it to the community for review.
          </>
        )}
      </div>
    </div>
  );
}
