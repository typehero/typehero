import { MentionInput } from '~/components/mention/mention-input';

export default function Page() {
  return (
    <div className="flex flex-col gap-8 py-8 md:gap-10 md:py-8">
      <div>
        <MentionInput />
      </div>
    </div>
  );
}
