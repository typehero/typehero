import { ChallengeLayout } from '../../components/challenge/challenge-layout';
import { CodePanel } from '../../components/challenge/editor';

const CreateChallenge = ({}) => {
  return <ChallengeLayout left={'left'} right={<CodePanel mode="create" />} />;
};

export default CreateChallenge;
