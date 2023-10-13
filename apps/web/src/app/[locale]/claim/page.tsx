import { ClaimForm } from './claim-form';

export default async function Claim() {
  return (
    <div className="container flex h-full flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 text-center sm:w-[550px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
            In early access?
          </h1>
          <p>Enter your emailed beta token.</p>
        </div>
        <ClaimForm />
      </div>
    </div>
  );
}
