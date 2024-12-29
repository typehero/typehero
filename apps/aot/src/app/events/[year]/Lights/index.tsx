import Strip from './Strip';

export default function ChristmasLights() {
  return (
    <div className="absolute inset-0 hidden h-full justify-center dark:flex">
      {[...Array(12)].map((_, i) => (
        <Strip key={i} delay={i * 0.125} />
      ))}
    </div>
  );
}
