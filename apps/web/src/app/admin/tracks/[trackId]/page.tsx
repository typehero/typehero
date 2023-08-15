export interface Props {
  params: {
    trackId: string;
  };
}

export default async function (props: Props) {
  return <div>Manage Track: {props.params.trackId}</div>;
}
