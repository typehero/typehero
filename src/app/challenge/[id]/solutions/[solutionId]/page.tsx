interface Props {
  params: {
    solutionId: string;
  };
}

export default async function SolutionPage({ params: { solutionId } }: Props) {
  return <div>some details go here for {solutionId}</div>;
}
