import { Footsies } from '~/components/footsies';

export default function LayoutPage(props: { children: React.ReactElement }) {
  return (
    <>
      <div className="container pb-8">{props.children}</div>

      <Footsies />
    </>
  );
}
