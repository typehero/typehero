'use client';

type Props = {
  upvote: number;
  incrementUpvote: (challengeId: number) => Promise<void>;
  challengeId: number;
  setUpvote: (upvote: number) => void;
};

export default function UpvoteButton({ incrementUpvote, challengeId, upvote, setUpvote }: Props) {
  return (
    <button
      className="rounded-lg bg-slate-700 p-4 text-white"
      onClick={async () => {
        const x = await incrementUpvote(challengeId, userId);
        setUpvote(x);
      }}
    >
      :arrow_up: {upvote}
    </button>
  );
}
