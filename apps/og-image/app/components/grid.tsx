export function Grid() {
  return (
    <div
      // @ts-ignore
      tw="absolute h-[150%] w-[150%]"
      style={{
        backgroundSize: '100px 60px',
        backgroundPosition: '55% 45%',
        backgroundImage:
          'linear-gradient(#fffe .1px, transparent 1px),linear-gradient(to right, #fffe .1px, transparent 1px)',
      }}
    ></div>
  );
}
