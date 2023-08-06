export interface ChallengeTagProps {
  value: string;
}

export default function ChallengeTag({ value }: ChallengeTagProps) {
  const determinedColor = parseInt(value.replace(/[^a-z0-9]/g, ''), 36)
    .toString(16)
    .replace(/.{1,2}/g, (f) => `0${f}`.slice(-2))
    .slice(0, 6);
  return (
    <span
      className={`inline-block rounded-full px-3 py-2 capitalize`}
      style={{ backgroundColor: '#' + determinedColor }}
    >
      {value}
    </span>
  );
}
