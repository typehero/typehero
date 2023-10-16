export function Grid() {
  return (
    <div
      // @ts-ignore
      tw="absolute h-[150%] w-[150%]"
      style={{
        backgroundSize: '81px 52px',
        backgroundPosition: '43% 48%',
        backgroundImage:
          'linear-gradient(#fff5 .1px, transparent 1px),linear-gradient(to right, #fff5 .1px, transparent 1px)',
      }}
    ></div>
  );
}
