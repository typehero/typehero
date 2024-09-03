import { AlertCircle, AtSign } from '@repo/ui/icons';

export function Empty({ type }: { type: 'all' | 'mentions' }) {
  return (
    <div className="flex h-full flex-col items-center justify-center p-4 text-center">
      {type === 'all' ? (
        <AlertCircle className="mb-4 h-12 w-12 text-muted-foreground" />
      ) : (
        <AtSign className="mb-4 h-12 w-12 text-muted-foreground" />
      )}
      <h3 className="mb-2 font-semibold text-foreground text-lg">
        {type === 'all' ? 'No notifications yet' : 'No mentions yet'}
      </h3>
      <p className="max-w-sm text-muted-foreground text-sm">
        {type === 'all'
          ? "When you get notifications, they'll show up here. Start by engaging with others in the comments."
          : "When someone mentions you in a comment, you'll see it here"}
      </p>
    </div>
  );
}
