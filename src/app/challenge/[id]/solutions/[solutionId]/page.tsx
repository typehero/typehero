interface Props {
  params: {
    solutionId: string;
  };
}
export default function SolutionPage({ params: { solutionId } }: Props) {
  return <div>Solution Details for Solution {solutionId}</div>;
}
