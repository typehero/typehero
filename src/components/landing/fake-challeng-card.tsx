const FakeChallengeCard = () => (
  <>
    <div className="flex flex-col rounded-3xl absolute top-0 right-0 bg-zinc-900 p-8 border dark:border-zinc-600 h-3/4 w-4/5 shadow-[0_0_1rem_#4448]"
      style={{ boxShadow: 'inset 1rem 1rem 3rem -0.5rem #fff1'}}
    >
      <h2 className="text-xl font-bold">Implement a JSON parser type</h2>
      <div className="rounded-xl -mx-2 bg-zinc-800 flex-grow mt-20"></div>
    </div>
    <div className="flex flex-col rounded-3xl absolute bottom-0 left-0 bg-zinc-900 p-8 border dark:border-zinc-600 h-4/5 w-4/5 shadow-[0_0_1rem_#4448]"
      style={{ boxShadow: 'inset 1rem 1rem 3rem -0.5rem #fff1, 1rem -1rem 3rem #0008'}}
    >
      <h2 className="text-xl font-bold">Implement a generic type</h2>
      <div className="rounded-xl -mx-2 bg-zinc-800 flex-grow mt-20"></div>
    </div>
  </>
)
export default FakeChallengeCard