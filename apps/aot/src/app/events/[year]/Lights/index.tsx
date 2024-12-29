import Strip from './Strip';

export default function ChristmasLights() {
  return (
    <div className="fixed inset-0 flex h-full justify-center">
      {[...Array(12)].map((_, i) => (
        <Strip key={i} delay={i * 0.125} />
      ))}
    </div>
  );
}
