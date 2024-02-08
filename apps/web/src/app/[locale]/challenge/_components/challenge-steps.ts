type StepsTour = { selector: string; content: string }[];

const steps: StepsTour = [
  {
    selector: '.challenge-tab-description',
    content: 'Read the challenge Infomation and Instructions',
  },
  {
    selector: '.challenge-tab-solutions',
    content: `Check Other's Solutions to the Challenge`,
  },
  {
    selector: '.challenge-tab-submissions',
    content: 'Find a List of Your Old Solutions',
  },
  {
    selector: '.challenge-editor-code',
    content: 'Write out the Code to Solve the Challenge Here. Edit the Code to Solve the Challenge',
  },
  {
    selector: '.challenge-editor-test',
    content: `This Tab Contains the Tests Used to Check If Your Code is Correct. It's Read-only and can not be Edited`,
  },
];

export default steps;
