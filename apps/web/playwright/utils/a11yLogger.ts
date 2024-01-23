import type axe from '@axe-core/playwright/node_modules/axe-core/axe';

export default class A11yError extends Error {
  violations: typeof axe.AxeResults.violations = [];
  constructor(violations: typeof axe.AxeResults.violations) {
    super();
    this.violations = violations;
    this.message = `
    ==================================================
    Axe Violations:
    ==================================================
    ${violations.map((violation) => {
      return `
      Description: ${violation.description}
      Impact: ${violation.impact}
      Help: ${violation.help}
      Help URL: ${violation.helpUrl}
      Failure Summary: ${violation.nodes[0]?.failureSummary}
      HTML: ${violation.nodes[0]?.html}
      ==================================================
      `;
    })}
    `;
  }
}
