'use client';

import { ChallengeLayout } from '../../components/challenge/challenge-layout';
import { CodePanel } from '../../components/challenge/editor';
import { Textarea } from '../../components/ui/textarea';

const CreateChallenge = ({}) => {
  return (
    <ChallengeLayout
      left={<Textarea placeholder="Type your message here." />}
      right={<CodePanel mode="create" onSubmit={console.log}/>}
    />
  );
};

export default CreateChallenge;
