import axe from '@axe-core/playwright/node_modules/axe-core/axe';

function A11yLogger(violations: typeof axe.AxeResults.violations): void {
  violations.forEach((violation) => {
    console.log('--------------------------------------------------');
    console.log('Description: ', violation.description);
    console.log('Impact: ', violation.impact);
    console.log('Help: ', violation.help);
    console.log('Help URL: ', violation.helpUrl);
    console.log('Failure Summary: \n', violation.nodes[0]?.failureSummary);
    console.log('HTML: \n', violation.nodes[0]?.html);
    console.log('--------------------------------------------------');
  });
}

export default A11yLogger;
