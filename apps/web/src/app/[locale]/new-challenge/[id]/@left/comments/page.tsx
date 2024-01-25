import Headers from "../../_components/header";

export default function ({ params: { id }}: { params: {id:string}}) {
  return <Headers slug="new-challenge" />;
}
