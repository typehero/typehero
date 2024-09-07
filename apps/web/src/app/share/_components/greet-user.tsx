import { auth } from '~/server/auth';

export async function GreetUser() {
  const session = await auth();
  return (
    <div className="flex flex-col items-center justify-center text-sm">
      <p>
        Welcome <span className="font-semibold">@{session?.user.name}</span>
      </p>
    </div>
  );
}
