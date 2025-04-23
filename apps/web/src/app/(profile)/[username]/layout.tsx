import { Footsies } from '~/components/footsies';

export default function LayoutPage(props: { children: React.ReactElement<HTMLDivElement> }) {
  return (
    <div className="flex h-full flex-col">
      <div className="container grow pb-8 md:mx-auto">{props.children}</div>

      <Footsies />
    </div>
  );
}
