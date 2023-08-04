interface Props {
  isUserACreator: boolean;
}
export function Summary({ isUserACreator }: Props) {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="mb-5 text-center text-5xl font-bold text-gray-900 dark:text-gray-100">
        {isUserACreator ? (
          <>Thanks for creating a challenge! Submit it to share with the community.</>
        ) : (
          <>Thanks for creating a challenge! Submit it to the community for review.</>
        )}
      </div>
    </div>
  );
}
